import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { ProgressRing } from '@/ui/components/ProgressRing';
import { EmptyState, Meter, Pill, SectionHeading, Stat } from '@/ui/components/Primitives';
import {
  useActiveExam,
  useActiveSession,
  useInsights,
  useLearner,
  useLearnerActions,
  useOutstandingMistakeCount,
  useReadiness,
  useRecommendation,
  useSelectionContext,
} from '@/app/state/useLearner';
import { READINESS_BAND_COPY } from '@/domain/readiness/readiness';
import { buildDailyTen, duePool } from '@/domain/selection/selection';
import { SESSION } from '@/domain/constants';
import type { InsightTone } from '@/domain/insights/insights';

function greeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 5) return 'God natt';
  if (hour < 10) return 'God morgon';
  if (hour < 12) return 'God förmiddag';
  if (hour < 17) return 'God dag';
  if (hour < 22) return 'God kväll';
  return 'God natt';
}

const insightToneClass: Record<InsightTone, string> = {
  positive: styles.insightPositive!,
  attention: styles.insightAttention!,
  neutral: styles.insightNeutral!,
};

const insightToneIcon: Record<InsightTone, 'check-circle' | 'alert' | 'info'> = {
  positive: 'check-circle',
  attention: 'alert',
  neutral: 'info',
};

/**
 * The home dashboard.
 *
 * It answers exactly one question: what should I do next? Analytics live on
 * the progress screen; here there is one recommendation, one readiness figure,
 * and four ways in.
 */
export function HomePage() {
  const learner = useLearner();
  const readiness = useReadiness();
  const recommendation = useRecommendation();
  const insights = useInsights();
  const actions = useLearnerActions();
  const navigate = useNavigate();
  const activeSession = useActiveSession();
  const activeExam = useActiveExam();
  const mistakes = useOutstandingMistakeCount();
  const context = useSelectionContext();

  const dueCount = useMemo(() => duePool(context).length, [context]);
  const dailyTen = useMemo(() => buildDailyTen(context), [context]);
  const hasStarted = learner.answers.length > 0;
  const onboardingDone = learner.profile.onboarding.completed;

  // Send genuinely new visitors through the short introduction once.
  useEffect(() => {
    if (!onboardingDone && !hasStarted) navigate('/introduktion', { replace: true });
  }, [onboardingDone, hasStarted, navigate]);

  const bandCopy = READINESS_BAND_COPY[readiness.band];
  const dailyMinutes = Math.max(
    1,
    Math.round(
      dailyTen.reduce((sum, q) => sum + (q.estimatedTimeSec || SESSION.estimatedSecondsPerQuestion), 0) /
        60,
    ),
  );

  const startRecommendation = () => {
    const started = actions.startSession({
      mode: recommendation.kind === 'due-review' ? 'review' : 'training',
      label: recommendation.title,
      questionIds: recommendation.questionIds,
      categoryId: recommendation.categoryId,
    });
    if (started) navigate('/trana/pass');
  };

  const startDailyTen = () => {
    const started = actions.startSession({
      mode: 'daily-ten',
      label: 'Dagens 10',
      questionIds: dailyTen.map((q) => q.id),
    });
    if (started) navigate('/trana/pass');
  };

  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <h1 className={styles.greetingText}>{greeting(new Date())}</h1>
        <p className={styles.greetingSub}>
          {hasStarted
            ? `${learner.profile.totals.answered} besvarade frågor hittills.`
            : 'Låt oss ta reda på var du står.'}
        </p>
      </header>

      {/* ---- Resume ------------------------------------------------------ */}
      {activeExam && (
        <div className={styles.resume}>
          <div className={styles.resumeText}>
            <div className={styles.resumeTitle}>Du har ett pågående prov</div>
            <div className={styles.resumeMeta}>Klockan fortsätter räkna ner.</div>
          </div>
          <ButtonLink to="/prov/pagaende">Fortsätt provet</ButtonLink>
        </div>
      )}

      {!activeExam && activeSession && (
        <div className={styles.resume}>
          <div className={styles.resumeText}>
            <div className={styles.resumeTitle}>Fortsätt där du slutade</div>
            <div className={styles.resumeMeta}>
              {activeSession.label} · fråga {activeSession.currentIndex + 1} av{' '}
              {activeSession.questions.length}
            </div>
          </div>
          <ButtonLink to="/trana/pass">Fortsätt</ButtonLink>
        </div>
      )}

      {/* ---- Readiness --------------------------------------------------- */}
      <section className={styles.readiness} aria-labelledby="readiness-heading">
        <ProgressRing
          value={readiness.score}
          size={168}
          thickness={12}
          label="Provberedskap"
          ariaLabel={
            readiness.score === null
              ? 'Provberedskap är inte mätt än'
              : `Provberedskap ${readiness.score} procent`
          }
        />
        <div className={styles.readinessBody}>
          <h2 className={styles.readinessBand} id="readiness-heading">
            {bandCopy.label}
          </h2>
          <p className={styles.readinessMessage}>{bandCopy.message}</p>
          {readiness.score === null && (
            <div className={styles.readinessCountdown}>
              <Meter
                value={readiness.answeredTotal}
                max={readiness.answeredTotal + readiness.answersUntilEstimate}
                height={6}
                ariaLabel={`${readiness.answeredTotal} av ${
                  readiness.answeredTotal + readiness.answersUntilEstimate
                } svar mot första uppskattningen`}
              />
              <p className={styles.readinessCountdownText}>
                {readiness.answersUntilEstimate === 1
                  ? 'Ett svar till, så gör vi din första uppskattning.'
                  : `${readiness.answersUntilEstimate} svar till, så gör vi din första uppskattning.`}
              </p>
            </div>
          )}

          <div className={styles.readinessMeta}>
            {readiness.provisional && readiness.score !== null && (
              <Pill tone="warning" icon="info">
                Preliminär
              </Pill>
            )}
            {learner.profile.streak.current > 0 && (
              <Pill tone="neutral" icon="flame">
                {learner.profile.streak.current}{' '}
                {learner.profile.streak.current === 1 ? 'dag' : 'dagar'} i rad
              </Pill>
            )}
            <Link
              to="/utveckling"
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-secondary)',
                alignSelf: 'center',
              }}
            >
              Hur räknas det?
            </Link>
          </div>
          <p className={styles.readinessNote}>
            Vägklars egen uppskattning av hur väl förberedd du är — inte en sannolikhet att klara
            det riktiga provet.
          </p>
        </div>
      </section>

      {/* ---- Next best step ---------------------------------------------- */}
      <section aria-labelledby="next-step-heading">
        <div className={styles.nextStep}>
          <div className={styles.nextStepLabel}>Nästa bästa steg</div>
          <h2 className={styles.nextStepTitle} id="next-step-heading">
            {recommendation.title}
          </h2>
          <p className={styles.nextStepReason}>{recommendation.reason}</p>
          <div className={styles.nextStepMeta}>
            <span className={styles.metaChip}>
              <Icon name="list" size={13} />
              {recommendation.questionIds.length} frågor
            </span>
            <span className={styles.metaChip}>
              <Icon name="clock" size={13} />~{recommendation.estimatedMinutes} min
            </span>
          </div>
          <div>
            <Button size="lg" variant="secondary" onClick={startRecommendation} iconAfter="arrow-right">
              {hasStarted ? 'Fortsätt träna' : 'Kom igång'}
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Quick entries ------------------------------------------------ */}
      <section aria-labelledby="quick-heading">
        <SectionHeading title="Snabbt igång" id="quick-heading" />
        <div className={styles.grid}>
          <button type="button" className={styles.tile} onClick={startDailyTen}>
            <span className={styles.tileIcon}>
              <Icon name="sparkle" size={19} />
            </span>
            <span className={styles.tileTitle}>Dagens 10</span>
            <span className={styles.tileMeta}>Blandat pass · ~{dailyMinutes} min</span>
          </button>

          <Link to="/trana" className={styles.tile}>
            <span className={styles.tileIcon}>
              <Icon name="practice" size={19} />
            </span>
            <span className={styles.tileTitle}>Snabbträning</span>
            <span className={styles.tileMeta}>5, 10 eller 20 frågor</span>
          </Link>

          <Link to="/prov" className={styles.tile}>
            <span className={styles.tileIcon}>
              <Icon name="exam" size={19} />
            </span>
            <span className={styles.tileTitle}>Provsimulering</span>
            <span className={styles.tileMeta}>70 frågor · 50 min</span>
          </Link>

          <Link to="/misstag" className={styles.tile}>
            <span className={styles.tileIcon}>
              <Icon name="refresh" size={19} />
            </span>
            <span className={styles.tileTitle}>Mina misstag</span>
            <span className={styles.tileMeta}>
              {mistakes > 0 ? `${mistakes} frågor att ta igen` : 'Inget olöst just nu'}
            </span>
          </Link>
        </div>
      </section>

      {dueCount > 0 && (
        <section aria-labelledby="due-heading">
          <SectionHeading
            title="Behöver repeteras"
            id="due-heading"
            action={{ label: 'Se allt', to: '/trana' }}
          />
          <div className={styles.resume}>
            <div className={styles.resumeText}>
              <div className={styles.resumeTitle}>
                {dueCount} {dueCount === 1 ? 'fråga' : 'frågor'} är mogna för repetition
              </div>
              <div className={styles.resumeMeta}>
                Repetition just när du är på väg att glömma ger störst effekt.
              </div>
            </div>
            <Button
              onClick={() => {
                const questions = duePool(context)
                  .slice(0, 10)
                  .map((c) => c.question.id);
                const started = actions.startSession({
                  mode: 'review',
                  label: 'Repetition',
                  questionIds: questions,
                });
                if (started) navigate('/trana/pass');
              }}
            >
              Repetera nu
            </Button>
          </div>
        </section>
      )}

      {/* ---- Insights ------------------------------------------------------ */}
      <section aria-labelledby="insights-heading">
        <SectionHeading
          overline="Så här går det"
          title="Vad din träning visar"
          id="insights-heading"
          action={{ label: 'Se utveckling', to: '/utveckling' }}
        />
        {insights.length > 0 ? (
          <div className={styles.insightList}>
            {insights.slice(0, 3).map((insight) => (
              <div className={styles.insight} key={insight.id}>
                <span className={[styles.insightIcon, insightToneClass[insight.tone]].join(' ')}>
                  <Icon name={insightToneIcon[insight.tone]} size={17} />
                </span>
                <div>
                  <div className={styles.insightTitle}>{insight.title}</div>
                  <div className={styles.insightBody}>{insight.body}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="lightbulb"
            title="Inga slutsatser än"
            body="När du svarat på ett antal frågor börjar Vägklar peka ut mönster — vad du är stark på och vad som fortfarande vacklar."
          />
        )}
      </section>

      {hasStarted && (
        <section aria-labelledby="totals-heading">
          <SectionHeading title="Totalt" id="totals-heading" level={3} />
          <div className={styles.statsStrip}>
            <div className={styles.statBox}>
              <Stat value={learner.profile.totals.answered} label="Svar" size="1.5rem" />
            </div>
            <div className={styles.statBox}>
              <Stat
                value={
                  learner.profile.totals.answered > 0
                    ? Math.round(
                        (learner.profile.totals.correct / learner.profile.totals.answered) * 100,
                      )
                    : 0
                }
                unit="%"
                label="Rätt totalt"
                size="1.5rem"
              />
            </div>
            <div className={styles.statBox}>
              <Stat value={learner.profile.totals.sessionsCompleted} label="Pass" size="1.5rem" />
            </div>
            <div className={styles.statBox}>
              <Stat value={learner.profile.totals.examAttempts} label="Prov" size="1.5rem" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
