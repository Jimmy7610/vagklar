import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styles from './Exam.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, Meter, SectionHeading, Stat } from '@/ui/components/Primitives';
import { Modal } from '@/ui/components/Modal';
import { masteryColor } from '@/ui/components/ProgressRing';
import { EXAM } from '@/domain/constants';
import { getCategoryName } from '@/content/taxonomy';
import { getQuestion } from '@/domain/content/bank';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import { useSelectionContext } from '@/app/state/useContent';
import { buildQuickSession } from '@/domain/selection/selection';

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes} min ${String(seconds).padStart(2, '0')} s`;
}

/**
 * Exam result.
 *
 * The score is stated against the pass line rather than as a bare number, and
 * the per-area breakdown is what turns a result into something actionable.
 */
export default function ExamResultPage() {
  const { attemptId } = useParams();
  const learner = useLearner();
  const actions = useLearnerActions();
  const context = useSelectionContext();
  const navigate = useNavigate();
  const [showUnscored, setShowUnscored] = useState(false);

  const attempt = useMemo(
    () => learner.exams.find((e) => e.id === attemptId),
    [learner.exams, attemptId],
  );

  const weakest = useMemo(() => {
    const result = attempt?.result;
    if (!result) return null;
    return result.byCategory
      .filter((entry) => entry.total >= 2)
      .map((entry) => ({ ...entry, ratio: entry.correct / entry.total }))
      .sort((a, b) => a.ratio - b.ratio)[0];
  }, [attempt]);

  if (!attempt || !attempt.result) return <Navigate to="/prov" replace />;
  const result = attempt.result;

  const trainWeakest = () => {
    if (!weakest) return;
    const questions = buildQuickSession(context, 10, {
      kind: 'category',
      categoryId: weakest.categoryId,
    });
    const started = actions.startSession({
      mode: 'training',
      label: getCategoryName(weakest.categoryId),
      questionIds: questions.map((q) => q.id),
      categoryId: weakest.categoryId,
    });
    if (started) navigate('/trana/pass');
  };

  return (
    <div className={styles.page}>
      <section
        className={[styles.verdict, result.passed ? styles.verdictPass : styles.verdictFail].join(' ')}
      >
        <span
          className={[
            styles.verdictBadge,
            result.passed ? styles.badgePass : styles.badgeFail,
          ].join(' ')}
        >
          <Icon name={result.passed ? 'check-circle' : 'x-circle'} size={16} />
          {result.passed ? 'Godkänd' : 'Inte godkänd'}
        </span>

        <div className={styles.scoreLine}>
          <span className={styles.scoreValue}>{result.score}</span>
          <span className={styles.scoreMax}>/ {result.scoredQuestions}</span>
        </div>

        <div style={{ width: 'min(420px, 100%)' }}>
          <Meter
            value={result.score}
            max={result.scoredQuestions}
            threshold={result.passThreshold}
            thresholdLabel={`Godkäntgräns: ${result.passThreshold}`}
            color={result.passed ? 'var(--color-success)' : 'var(--color-warning)'}
            height={10}
            ariaLabel={`${result.score} av ${result.scoredQuestions} poäng`}
          />
          <p
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-2)',
            }}
          >
            Godkäntgräns: {result.passThreshold} poäng
            {result.passed
              ? ` · du klarade den med ${result.score - result.passThreshold} poängs marginal`
              : ` · du saknade ${result.passThreshold - result.score} poäng`}
          </p>
        </div>

        {attempt.status === 'expired' && (
          <Callout tone="warning">Tiden tog slut och provet lämnades in automatiskt.</Callout>
        )}
      </section>

      <section className={styles.specs} aria-label="Sammanfattning">
        <div className={styles.spec}>
          <Stat value={result.answered} label="Besvarade" size="1.75rem" />
        </div>
        <div className={styles.spec}>
          <Stat value={result.unanswered} label="Obesvarade" size="1.75rem" />
        </div>
        <div className={styles.spec}>
          <Stat value={formatDuration(result.durationMs)} label="Tid" size="1.25rem" />
        </div>
      </section>

      <Callout tone="neutral" icon="info">
        {EXAM.unscoredQuestions} frågor räknades inte in i resultatet, för att efterlikna provets
        struktur. Räknat på alla {attempt.questions.length} frågor hade du {result.correctIncludingUnscored}{' '}
        rätt.{' '}
        <button
          type="button"
          onClick={() => setShowUnscored(true)}
          style={{
            color: 'inherit',
            textDecoration: 'underline',
            fontWeight: 600,
            fontSize: 'inherit',
          }}
        >
          Vilka frågor var det?
        </button>
      </Callout>

      <section aria-labelledby="breakdown-heading">
        <SectionHeading title="Resultat per område" id="breakdown-heading" />
        <div className={styles.breakdown}>
          {result.byCategory.map((entry) => {
            const percent = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
            return (
              <div className={styles.breakdownRow} key={entry.categoryId}>
                <span className={styles.breakdownName}>{getCategoryName(entry.categoryId)}</span>
                <span className={styles.breakdownValue}>
                  {entry.correct} / {entry.total}
                </span>
                <span className={styles.breakdownBar}>
                  <span
                    className={styles.breakdownFill}
                    style={{ width: `${percent}%`, backgroundColor: masteryColor(percent) }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {weakest && (
        <Callout tone="info">
          <strong>Svagast: {getCategoryName(weakest.categoryId)}</strong> — {weakest.correct} av{' '}
          {weakest.total} rätt. Det är där du får mest tillbaka för din tid just nu.
        </Callout>
      )}

      <div className={styles.resultActions}>
        {weakest && (
          <Button size="lg" onClick={trainWeakest}>
            Träna {getCategoryName(weakest.categoryId).toLowerCase()}
          </Button>
        )}
        <ButtonLink to="/misstag" size="lg" variant="secondary">
          Se mina misstag
        </ButtonLink>
        <ButtonLink to="/prov" size="lg" variant="secondary">
          Till provsimuleringen
        </ButtonLink>
      </div>

      <Modal
        open={showUnscored}
        onClose={() => setShowUnscored(false)}
        title="Frågor som inte räknades"
        description={`I den här simuleringen valdes ${EXAM.unscoredQuestions} frågor ut slumpmässigt och räknades inte in i resultatet.`}
      >
        <p
          style={{
            fontSize: 'var(--text-small)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Vi vet ingenting om vilka frågor som är oräknade i det riktiga provet. Vägklar väljer sina
          egna, deterministiskt utifrån provets startvärde, enbart för att efterlikna strukturen.
        </p>
        <ul style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {result.unscoredQuestionIds.map((id) => {
            const question = getQuestion(id);
            if (!question) return null;
            return (
              <li
                key={id}
                style={{
                  fontSize: 'var(--text-small)',
                  paddingBottom: 'var(--space-3)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {getCategoryName(question.category)}
                </span>
                <br />
                {question.prompt}
              </li>
            );
          })}
        </ul>
      </Modal>
    </div>
  );
}
