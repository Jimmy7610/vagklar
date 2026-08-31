import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './Exam.module.css';
import { Button } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Modal } from '@/ui/components/Modal';
import { RoadSign, hasRoadSign } from '@/ui/illustrations/RoadSign';
import { useActiveExam, useLearnerActions } from '@/app/state/useLearner';
import { getQuestion } from '@/domain/content/bank';
import { EXAM } from '@/domain/constants';
import { answeredCount, markedCount, remainingMs, unansweredIndices } from '@/domain/exam/exam';
import { useLearner } from '@/app/state/useLearner';
import { useSecondClock } from '@/app/state/clock';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * The exam runner.
 *
 * No correctness feedback of any kind while the exam is running. The deadline
 * lives on the persisted attempt, so reloading, closing the tab or going
 * offline cannot buy extra time — the store finalises an expired attempt on
 * load.
 */
export default function ExamRunnerPage() {
  const attempt = useActiveExam();
  const learner = useLearner();
  const actions = useLearnerActions();
  const navigate = useNavigate();
  const now = useSecondClock();
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  // When the current question was first shown, used to record response time.
  const shownAt = useRef(0);

  const currentIndex = attempt?.currentIndex ?? 0;

  useEffect(() => {
    shownAt.current = Date.now();
  }, [currentIndex]);

  /*
   * The deadline is enforced from the shared second clock rather than a local
   * interval, so a backgrounded tab that stops ticking still finalises the
   * attempt the moment it comes back — the clock refreshes on subscribe.
   */
  useEffect(() => {
    actions.enforceExamDeadline(now);
  }, [now, actions]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') actions.enforceExamDeadline();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [actions]);

  /*
   * Once the attempt is finalised — by submitting or by the deadline — the
   * store keeps `activeExamId` pointing at it. Looking the result up from
   * there makes the redirect deterministic instead of racing the state update
   * that clears the running attempt.
   */
  const finishedAttempt = useMemo(
    () => learner.exams.find((e) => e.id === learner.activeExamId && e.result !== null),
    [learner.exams, learner.activeExamId],
  );

  const submit = useCallback(() => {
    const finished = actions.finishExam();
    setConfirmSubmit(false);
    if (finished) navigate(`/prov/resultat/${finished.id}`, { replace: true });
  }, [actions, navigate]);

  const question = attempt ? getQuestion(attempt.questions[currentIndex]?.questionId ?? '') : undefined;
  const state = attempt?.questions[currentIndex];

  /* Keyboard: A–D select, arrows navigate. */
  useEffect(() => {
    if (!attempt || !question) return;
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        actions.goToExamIndex(currentIndex + 1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        actions.goToExamIndex(currentIndex - 1);
        return;
      }

      const key = event.key.toUpperCase();
      let position = OPTION_KEYS.indexOf(key);
      if (position === -1 && /^[1-9]$/.test(event.key)) position = Number(event.key) - 1;
      const answer = position >= 0 ? question.answers[position] : undefined;
      if (answer) {
        event.preventDefault();
        actions.answerExam(currentIndex, answer.id, Date.now() - (shownAt.current || Date.now()));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions, attempt, currentIndex, question]);

  if (!attempt) {
    if (finishedAttempt) return <Navigate to={`/prov/resultat/${finishedAttempt.id}`} replace />;
    return <Navigate to="/prov" replace />;
  }
  if (!question || !state) return <Navigate to="/prov" replace />;

  const left = remainingMs(attempt, now);
  const answered = answeredCount(attempt);
  const marked = markedCount(attempt);
  const unanswered = unansweredIndices(attempt);
  const total = attempt.questions.length;
  const critical = left <= 60 * 1000;
  const warning = !critical && left <= EXAM.warnAtRemainingMs;
  const illustration = question.image?.illustration;

  const navigator = (
    <div className={styles.navigator}>
      <div className={styles.navigatorHead}>
        <span>
          {answered} av {total} besvarade
        </span>
        {marked > 0 && <span>{marked} markerade</span>}
      </div>
      <div className={styles.navigatorGrid}>
        {attempt.questions.map((item, index) => (
          <button
            key={item.questionId}
            type="button"
            className={[
              styles.navCell,
              item.selectedAnswerId !== null ? styles.navAnswered : '',
              index === currentIndex ? styles.navCurrent : '',
              item.marked ? styles.navMarked : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              actions.goToExamIndex(index);
              setShowNavigator(false);
            }}
            aria-label={`Fråga ${index + 1}${
              item.selectedAnswerId !== null ? ', besvarad' : ', obesvarad'
            }${item.marked ? ', markerad' : ''}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ backgroundColor: 'var(--color-primary-soft)' }}
          />
          Besvarad
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} />
          Obesvarad
        </span>
        <span className={styles.legendItem}>
          <span
            className={styles.legendSwatch}
            style={{ backgroundColor: 'var(--color-warning)', borderColor: 'transparent' }}
          />
          Markerad för återbesök
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.runner}>
      <div className={styles.runnerBar}>
        <span style={{ fontSize: 'var(--text-small)', fontWeight: 600 }}>
          Fråga {currentIndex + 1} / {total}
        </span>

        {learner.preferences.calmExamTimer ? (
          <div
            className={styles.timerBarTrack}
            role="timer"
            aria-label={`${Math.ceil(left / 60000)} minuter kvar`}
          >
            <div
              className={styles.timerBarFill}
              style={{
                width: `${(left / EXAM.durationMs) * 100}%`,
                backgroundColor: critical
                  ? 'var(--color-danger)'
                  : warning
                    ? 'var(--color-warning)'
                    : 'var(--color-primary)',
              }}
            />
          </div>
        ) : (
          <span
            className={[
              styles.timer,
              warning ? styles.timerWarning : '',
              critical ? styles.timerCritical : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="timer"
            aria-live="off"
          >
            <Icon name="clock" size={15} />
            {formatClock(left)}
          </span>
        )}

        <Button variant="ghost" size="sm" onClick={() => setConfirmSubmit(true)}>
          Lämna in
        </Button>
      </div>

      <div className={styles.runnerBody}>
        <div className={styles.question}>
          <div className={styles.examMeta}>
            <span>{answered} av {total} besvarade</span>
            <button
              type="button"
              className={[styles.markButton, state.marked ? styles.marked : ''].filter(Boolean).join(' ')}
              onClick={() => actions.markExamQuestion(currentIndex)}
              aria-pressed={state.marked}
            >
              <Icon name={state.marked ? 'bookmark-filled' : 'bookmark'} size={15} />
              {state.marked ? 'Markerad' : 'Markera'}
            </button>
          </div>

          <h1 className={styles.examPrompt}>{question.prompt}</h1>

          {illustration && hasRoadSign(illustration) && (
            <figure
              style={{
                display: 'grid',
                justifyItems: 'center',
                padding: 'var(--space-5)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                margin: '0 0 var(--space-5)',
              }}
            >
              <RoadSign name={illustration} size={110} alt={question.image?.alt ?? ''} />
            </figure>
          )}

          <div className={styles.options} role="group" aria-label="Svarsalternativ">
            {question.answers.map((answer, position) => (
              <button
                key={answer.id}
                type="button"
                className={[
                  styles.option,
                  state.selectedAnswerId === answer.id ? styles.optionSelected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  actions.answerExam(currentIndex, answer.id, Date.now() - (shownAt.current || Date.now()))
                }
                aria-pressed={state.selectedAnswerId === answer.id}
              >
                <span className={styles.optionKey} aria-hidden="true">
                  {OPTION_KEYS[position]}
                </span>
                <span>{answer.text}</span>
              </button>
            ))}
          </div>

          <div className={styles.navigatorMobile} style={{ marginBottom: 'var(--space-5)' }}>
            <Button variant="secondary" block icon="grid" onClick={() => setShowNavigator(true)}>
              Översikt över frågorna
            </Button>
          </div>

          <div className={styles.navRow}>
            <Button
              variant="secondary"
              size="lg"
              icon="chevron-left"
              onClick={() => actions.goToExamIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              Föregående
            </Button>
            {currentIndex === total - 1 ? (
              <Button size="lg" onClick={() => setConfirmSubmit(true)}>
                Lämna in
              </Button>
            ) : (
              <Button
                size="lg"
                iconAfter="chevron-right"
                onClick={() => actions.goToExamIndex(currentIndex + 1)}
              >
                Nästa
              </Button>
            )}
          </div>
        </div>

        <aside className={[styles.navigatorDesktop, styles.navigatorSticky].join(' ')}>
          {navigator}
        </aside>
      </div>

      <Modal
        open={showNavigator}
        onClose={() => setShowNavigator(false)}
        title="Frågeöversikt"
        description="Hoppa till en fråga eller se vad som är kvar."
      >
        {navigator}
      </Modal>

      <Modal
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        title="Lämna in provet?"
        description={
          unanswered.length > 0
            ? `${unanswered.length} ${unanswered.length === 1 ? 'fråga är' : 'frågor är'} fortfarande obesvarad${unanswered.length === 1 ? '' : 'e'}.`
            : 'Alla frågor är besvarade.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmSubmit(false)}>
              Tillbaka till provet
            </Button>
            <Button onClick={submit} data-autofocus>
              Lämna in
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
          {unanswered.length > 0
            ? 'Obesvarade frågor räknas som fel. Du hinner fortfarande gå tillbaka.'
            : 'Efter inlämning kan du inte ändra dina svar.'}
        </p>
        {unanswered.length > 0 && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Button
              variant="soft"
              block
              onClick={() => {
                const first = unanswered[0];
                if (first !== undefined) actions.goToExamIndex(first);
                setConfirmSubmit(false);
              }}
            >
              Gå till första obesvarade
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
