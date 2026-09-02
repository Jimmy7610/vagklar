import { useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './SessionPage.module.css';
import { QuestionCard } from './QuestionCard';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Modal } from '@/ui/components/Modal';
import { Callout, Pill, Stat } from '@/ui/components/Primitives';
import { ProgressRing } from '@/ui/components/ProgressRing';
import { useActiveSession, useLearner, useLearnerActions } from '@/app/state/useLearner';
import { useRecommendation } from '@/app/state/useContent';
import { getQuestion } from '@/domain/content/bank';
import { getSubcategoryName } from '@/content/taxonomy';
import type { SessionSummary } from '@/domain/learner/types';
import { useUi } from '@/app/state/UiProvider';

/**
 * Focus mode.
 *
 * Navigation is stripped back to a single exit affordance so nothing competes
 * with the question. The session is persisted after every answer, so closing
 * the tab mid-pass loses nothing.
 */
export default function SessionPage() {
  const session = useActiveSession();
  const learner = useLearner();
  const actions = useLearnerActions();
  const navigate = useNavigate();
  const { toast } = useUi();
  const [confirmExit, setConfirmExit] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const recommendation = useRecommendation();

  const current = session?.questions[session.currentIndex];
  const question = current ? getQuestion(current.questionId) : undefined;

  const handleAnswer = useCallback(
    (answerId: string, responseMs: number) => {
      if (!question) return;
      actions.answer(question.id, answerId, responseMs);
    },
    [actions, question],
  );

  const handleNext = useCallback(() => {
    if (!session) return;
    const isLast = session.currentIndex >= session.questions.length - 1;
    if (!isLast) {
      actions.goToIndex(session.currentIndex + 1);
      return;
    }
    const result = actions.completeSession();
    if (result) setSummary(result);
  }, [actions, session]);

  /*
   * Mastery movement.
   *
   * An area the learner had never touched starts at zero, so *any* answer —
   * including a wrong one — nudges it upward. Reporting that as "improved"
   * would be misleading, so first-time areas are labelled as newly started
   * instead, and only areas with prior data count as improvements.
   */
  const movements = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.masteryDelta)
      .map(([subcategoryId, delta]) => ({
        subcategoryId,
        delta,
        isNew: (summary.masteryBefore[subcategoryId] ?? 0) === 0,
      }))
      .filter((entry) => Math.abs(entry.delta) >= 0.005)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 5);
  }, [summary]);

  /* ---- Summary ------------------------------------------------------ */
  if (summary) {
    const accuracy =
      summary.answered > 0 ? Math.round((summary.correct / summary.answered) * 100) : 0;
    const minutes = Math.max(1, Math.round(summary.durationMs / 60000));
    const improved = movements.filter((m) => m.delta > 0 && !m.isNew).length;
    const started = movements.filter((m) => m.isNew).length;

    return (
      <div className={styles.page}>
        <div className={styles.bar}>
          <span className={styles.barTitle}>Passet klart</span>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => navigate('/hem')}
            aria-label="Stäng"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.summary}>
            <div className={styles.summaryHead}>
              <ProgressRing
                value={accuracy}
                size={132}
                thickness={10}
                label="Rätt"
                valueFontSize="2.25rem"
                ariaLabel={`${accuracy} procent rätt`}
              />
              <h1 className={styles.summaryTitle}>{summary.label}</h1>
              <p className={styles.summaryLead}>
                {summary.correct} av {summary.answered} rätt
                {improved > 0
                  ? `. ${improved} ${improved === 1 ? 'område' : 'områden'} förbättrades.`
                  : started > 0
                    ? `. ${started} ${started === 1 ? 'nytt område' : 'nya områden'} påbörjade.`
                    : '.'}
              </p>
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <Stat value={summary.answered} label="Frågor" size="1.75rem" />
              </div>
              <div className={styles.statCard}>
                <Stat value={accuracy} unit="%" label="Träffsäkerhet" size="1.75rem" />
              </div>
              <div className={styles.statCard}>
                <Stat value={minutes} unit=" min" label="Tid" size="1.75rem" />
              </div>
            </div>

            {movements.length > 0 ? (
              <section>
                <h2
                  style={{
                    fontSize: 'var(--text-subsection)',
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  Så rörde sig din behärskning
                </h2>
                <div className={styles.movementList}>
                  {movements.map((movement) => {
                    const points = Math.round(movement.delta * 100);
                    const tone =
                      points > 0
                        ? styles.movementUp
                        : points < 0
                          ? styles.movementDown
                          : styles.movementFlat;
                    return (
                      <div className={styles.movementRow} key={movement.subcategoryId}>
                        <span className={styles.movementName}>
                          {getSubcategoryName(movement.subcategoryId)}
                        </span>
                        {movement.isNew ? (
                          <Pill tone="neutral">Nytt · {points}%</Pill>
                        ) : (
                          <span className={[styles.movementValue, tone].join(' ')}>
                            <Icon
                              name={points >= 0 ? 'chevron-up' : 'chevron-down'}
                              size={15}
                              label={points >= 0 ? 'ökade' : 'minskade'}
                            />
                            {points > 0 ? '+' : ''}
                            {points} p
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : (
              <Callout tone="neutral">
                Behärskningen rörde sig knappt den här gången. Det är normalt när du redan ligger
                stabilt i områdena du tränade.
              </Callout>
            )}

            <section>
              <h2 style={{ fontSize: 'var(--text-subsection)', marginBottom: 'var(--space-3)' }}>
                Nästa bästa steg
              </h2>
              <Callout tone="info">
                <strong>{recommendation.title}</strong> — {recommendation.reason}
              </Callout>
            </section>

            <div className={styles.summaryActions}>
              <Button
                size="lg"
                onClick={() => {
                  const started = actions.startSession({
                    mode: 'training',
                    label: recommendation.title,
                    questionIds: recommendation.questionIds,
                  });
                  if (started) {
                    setSummary(null);
                  } else {
                    toast('Kunde inte starta ett nytt pass just nu.', { tone: 'warning' });
                  }
                }}
              >
                Fortsätt träna
              </Button>
              <ButtonLink to="/hem" size="lg" variant="secondary">
                Till startsidan
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !question || !current) {
    return <Navigate to="/trana" replace />;
  }

  const isSaved = learner.questionStates[question.id]?.saved ?? false;

  return (
    <div className={styles.page}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setConfirmExit(true)}
          aria-label="Avsluta passet"
        >
          <Icon name="close" size={22} />
        </button>
        <span className={styles.barTitle}>{session.label}</span>
        <span style={{ width: 40 }} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <QuestionCard
          key={`${session.id}-${question.id}`}
          question={question}
          index={session.currentIndex}
          total={session.questions.length}
          selectedAnswerId={current.selectedAnswerId}
          confidence={current.confidence}
          responseMs={current.responseMs}
          onAnswer={handleAnswer}
          onConfidence={(value) => actions.setConfidence(question.id, value)}
          onNext={handleNext}
          onSave={() => {
            actions.toggleSaved(question.id);
            toast(isSaved ? 'Frågan togs bort från sparade.' : 'Frågan sparad.', {
              icon: 'bookmark',
            });
          }}
          isSaved={isSaved}
          confidencePrompt={learner.preferences.confidencePrompt}
        />
      </div>

      <Modal
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
        title="Avsluta passet?"
        description="Du kan fortsätta senare — passet sparas där du är."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmExit(false)}>
              Fortsätt träna
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmExit(false);
                navigate('/hem');
              }}
            >
              Pausa och gå ut
            </Button>
            <Button
              variant="dangerGhost"
              onClick={() => {
                actions.abandonSession();
                setConfirmExit(false);
                navigate('/trana');
              }}
            >
              Avbryt passet
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-small)' }}>
          Svaren du redan gett är sparade och räknas med i din utveckling oavsett vad du väljer.
        </p>
      </Modal>
    </div>
  );
}
