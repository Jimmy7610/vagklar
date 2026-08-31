import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './QuestionCard.module.css';
import { Button } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { RoadSign, hasRoadSign } from '@/ui/illustrations/RoadSign';
import { getCategoryName, getSubcategoryName } from '@/content/taxonomy';
import type { Question } from '@/domain/content/types';
import type { Confidence, ConfidencePrompt } from '@/domain/learner/types';

const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E', 'F'];

export interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  /** Set once the learner has answered. */
  selectedAnswerId: string | null;
  confidence: Confidence | null;
  /** How long the answer took, once given. Drives smart confidence prompting. */
  responseMs: number | null;
  onAnswer: (answerId: string, responseMs: number) => void;
  onConfidence: (confidence: Confidence) => void;
  onNext: () => void;
  onSave: () => void;
  isSaved: boolean;
  confidencePrompt: ConfidencePrompt;
  nextLabel?: string;
  /** Hide correctness — used by lesson checks that reveal later. */
  showFeedback?: boolean;
}

/**
 * The training question.
 *
 * One screen, one job. After an answer the card reveals the verdict, the short
 * explanation and only then the optional depth — so the learner reads the
 * reason before deciding whether they want more.
 *
 * Keyboard: A–D or 1–4 select an alternative, Enter continues. Enter never
 * triggers anything destructive.
 */
export function QuestionCard({
  question,
  index,
  total,
  selectedAnswerId,
  confidence,
  responseMs,
  onAnswer,
  onConfidence,
  onNext,
  onSave,
  isSaved,
  confidencePrompt,
  nextLabel,
  showFeedback = true,
}: QuestionCardProps) {
  const [showDeep, setShowDeep] = useState(false);
  // The card is remounted per question (keyed by the caller), so the timer
  // starts fresh without a reset effect.
  const shownAt = useRef<number>(0);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const answered = selectedAnswerId !== null;
  const isCorrect = answered && selectedAnswerId === question.correctAnswerId;

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (answered) return;
      const startedAt = shownAt.current || Date.now();
      onAnswer(answerId, Date.now() - startedAt);
    },
    [answered, onAnswer],
  );

  /* Keyboard shortcuts ------------------------------------------------- */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key === 'Enter' && answered) {
        event.preventDefault();
        onNext();
        return;
      }

      if (answered) return;

      const key = event.key.toUpperCase();
      let position = OPTION_KEYS.indexOf(key);
      if (position === -1 && /^[1-9]$/.test(event.key)) {
        position = Number(event.key) - 1;
      }
      const answer = position >= 0 ? question.answers[position] : undefined;
      if (answer) {
        event.preventDefault();
        handleAnswer(answer.id);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [answered, handleAnswer, onNext, question.answers]);

  /*
   * Move focus to the feedback when it appears so screen-reader and keyboard
   * users land on the explanation rather than being left on a disabled button.
   * The page is not scrolled, so sighted users keep their reading position.
   */
  useEffect(() => {
    if (answered && showFeedback) feedbackRef.current?.focus();
  }, [answered, showFeedback]);

  /*
   * Confidence prompting. In "smart" mode we only ask when the answer is
   * genuinely informative: after a mistake, or on a correct answer that took
   * unusually long. Asking after every single question destroys the flow.
   */
  const askConfidence = useMemo(() => {
    if (!answered || !showFeedback) return false;
    if (confidencePrompt === 'never') return false;
    if (confidencePrompt === 'always') return true;
    if (!isCorrect) return true;
    return (responseMs ?? 0) > question.estimatedTimeSec * 1000 * 1.4;
  }, [answered, confidencePrompt, isCorrect, responseMs, question.estimatedTimeSec, showFeedback]);

  const progress = total > 0 ? ((index + (answered ? 1 : 0)) / total) * 100 : 0;
  const illustration = question.image?.illustration;

  return (
    <div className={styles.wrap}>
      <div>
        <div className={styles.head}>
          <span className={styles.category}>
            {getCategoryName(question.category)} · {getSubcategoryName(question.subcategory)}
          </span>
          <span className={styles.counter}>
            {index + 1} / {total}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className="visually-hidden" aria-live="polite">
          Fråga {index + 1} av {total}
        </span>
      </div>

      <h1 className={styles.prompt}>{question.prompt}</h1>

      {illustration && hasRoadSign(illustration) && (
        <figure className={styles.figure}>
          <RoadSign name={illustration} size={116} alt={question.image?.alt ?? ''} />
          {question.accessibilityText && (
            <figcaption className={styles.figureCaption}>{question.accessibilityText}</figcaption>
          )}
        </figure>
      )}

      <div className={styles.answers} role="group" aria-label="Svarsalternativ">
        {question.answers.map((answer, position) => {
          const isSelected = selectedAnswerId === answer.id;
          const isRight = answer.id === question.correctAnswerId;
          const reveal = answered && showFeedback;

          const className = [
            styles.answer,
            reveal && isSelected && isRight ? styles.correct : '',
            reveal && isSelected && !isRight ? styles.incorrect : '',
            reveal && !isSelected && isRight ? styles.revealed : '',
            reveal && !isSelected && !isRight ? styles.dimmed : '',
            answered && !showFeedback && isSelected ? styles.correct : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={answer.id}
              type="button"
              className={className}
              onClick={() => handleAnswer(answer.id)}
              disabled={answered}
              aria-pressed={isSelected}
            >
              <span className={styles.key} aria-hidden="true">
                {OPTION_KEYS[position]}
              </span>
              <span className={styles.answerText}>{answer.text}</span>
              {reveal && (isSelected || isRight) && (
                <span className={styles.mark}>
                  <Icon
                    name={isRight ? 'check-circle' : 'x-circle'}
                    size={20}
                    label={isRight ? 'Rätt svar' : 'Ditt svar, felaktigt'}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {answered && showFeedback && (
        <div className={styles.feedback} ref={feedbackRef} tabIndex={-1} aria-live="polite">
          <div
            className={[
              styles.verdict,
              isCorrect ? styles.verdictCorrect : styles.verdictIncorrect,
            ].join(' ')}
          >
            <Icon name={isCorrect ? 'check-circle' : 'x-circle'} size={22} />
            {isCorrect ? 'Rätt' : 'Inte riktigt'}
          </div>

          <p className={styles.explanation}>{question.shortExplanation}</p>

          {question.memoryRule && (
            <p className={styles.memory}>
              <Icon name="lightbulb" size={17} />
              {question.memoryRule}
            </p>
          )}

          {showDeep && question.deepExplanation && (
            <p className={styles.deep}>{question.deepExplanation}</p>
          )}

          <div className={styles.feedbackActions}>
            {question.deepExplanation && !showDeep && (
              <Button variant="ghost" size="sm" icon="info" onClick={() => setShowDeep(true)}>
                Förklara mer
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={isSaved ? 'bookmark-filled' : 'bookmark'}
              onClick={onSave}
            >
              {isSaved ? 'Sparad' : 'Spara frågan'}
            </Button>
          </div>
        </div>
      )}

      {askConfidence && (
        <div className={styles.confidence}>
          <span className={styles.confidenceLabel} id="confidence-label">
            Hur säker var du?
          </span>
          <div className={styles.confidenceOptions} role="group" aria-labelledby="confidence-label">
            {(
              [
                { value: 'known', label: 'Visste det' },
                { value: 'uncertain', label: 'Osäker' },
                { value: 'guessed', label: 'Gissade' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                className={[
                  styles.confidenceButton,
                  confidence === option.value ? styles.confidenceActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onConfidence(option.value)}
                aria-pressed={confidence === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {answered && (
        <div className={styles.footer}>
          <Button size="lg" block onClick={onNext} iconAfter="arrow-right">
            {nextLabel ?? (index + 1 >= total ? 'Avsluta passet' : 'Nästa fråga')}
          </Button>
        </div>
      )}

      {!answered && <p className={styles.hint}>Tips: välj med A–D eller 1–4, fortsätt med Enter.</p>}
    </div>
  );
}
