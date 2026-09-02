import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import {
  Callout,
  EmptyState,
  Meter,
  Pill,
  SectionHeading,
  Stat,
} from '@/ui/components/Primitives';
import { masteryColor } from '@/ui/components/ProgressRing';
import { getCategoryName, SUBCATEGORY_BY_ID } from '@/content/taxonomy';
import { QUESTIONS_BY_SUBCATEGORY } from '@/domain/content/bank';
import { MASTERY_LEVEL_LABEL, masteryLevel } from '@/domain/mastery/mastery';
import { groupMistakes } from '@/domain/insights/insights';
import { buildQuickSession } from '@/domain/selection/selection';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import { useSelectionContext } from '@/app/state/useContent';
import { LESSONS } from '@/content/lessons';

/**
 * A single knowledge area.
 *
 * Answers three questions in order: where do I stand, what have I got wrong
 * here, and what do I do about it.
 */
export default function SubcategoryPage() {
  const { subcategoryId } = useParams();
  const learner = useLearner();
  const actions = useLearnerActions();
  const context = useSelectionContext();
  const navigate = useNavigate();

  const meta = subcategoryId ? SUBCATEGORY_BY_ID.get(subcategoryId) : undefined;
  const state = subcategoryId ? learner.mastery[subcategoryId] : undefined;
  const questions = subcategoryId ? (QUESTIONS_BY_SUBCATEGORY.get(subcategoryId) ?? []) : [];

  const answers = useMemo(
    () => learner.answers.filter((a) => a.subcategory === subcategoryId),
    [learner.answers, subcategoryId],
  );

  const mistakes = useMemo(
    () => groupMistakes(answers).slice(0, 4),
    [answers],
  );

  const lesson = useMemo(
    () => LESSONS.find((l) => subcategoryId && l.subcategoryIds.includes(subcategoryId)),
    [subcategoryId],
  );

  if (!meta || !subcategoryId) return <Navigate to="/utveckling" replace />;

  const percent = Math.round((state?.score ?? 0) * 100);
  const level = masteryLevel(state);
  const recent = answers.slice(-10).reverse();
  const accuracy =
    answers.length > 0
      ? Math.round((answers.filter((a) => a.correct).length / answers.length) * 100)
      : 0;

  const train = () => {
    const selected = buildQuickSession(context, Math.min(10, questions.length), {
      kind: 'subcategory',
      subcategoryId,
    });
    const started = actions.startSession({
      mode: 'training',
      label: meta.name,
      questionIds: selected.map((q) => q.id),
      categoryId: meta.categoryId,
    });
    if (started) navigate('/trana/pass');
  };

  return (
    <div className={page.page}>
      <header className={page.header}>
        <Link to="/utveckling" className={page.backLink}>
          <Icon name="chevron-left" size={16} />
          Kunskapskartan
        </Link>
        <h1 className={page.title}>{meta.name}</h1>
        <p className={page.lead}>
          {getCategoryName(meta.categoryId)} · {questions.length} frågor
        </p>
      </header>

      <div className={page.panel}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Stat
            value={state?.observations ? `${percent}%` : '—'}
            label="Behärskning"
            size="var(--text-stat)"
          />
          <Pill
            tone={
              level === 'mastered' || level === 'strong'
                ? 'success'
                : level === 'developing'
                  ? 'warning'
                  : level === 'weak'
                    ? 'danger'
                    : 'outline'
            }
          >
            {MASTERY_LEVEL_LABEL[level]}
          </Pill>
        </div>

        <Meter
          value={percent}
          color={masteryColor(state?.observations ? percent : null)}
          height={8}
          ariaLabel={`Behärskning ${percent} procent`}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-5)',
          }}
        >
          <Stat value={answers.length} label="Svar här" size="1.375rem" />
          <Stat value={`${accuracy}%`} label="Rätt" size="1.375rem" />
          <Stat
            value={state?.observations ?? 0}
            label="Observationer"
            size="1.375rem"
          />
        </div>

        {(state?.observations ?? 0) < 3 && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Callout tone="neutral">
              För få svar för en säker bedömning. Några frågor till ger en tydligare bild.
            </Callout>
          </div>
        )}
      </div>

      <div className={page.actions}>
        <Button size="lg" onClick={train} disabled={questions.length === 0}>
          Träna detta
        </Button>
        {lesson && (
          <ButtonLink to={`/teori/${lesson.id}`} size="lg" variant="secondary" icon="book">
            Läs regeln
          </ButtonLink>
        )}
      </div>

      <section aria-labelledby="mistakes-heading">
        <SectionHeading title="Vanliga misstag här" id="mistakes-heading" />
        {mistakes.length === 0 ? (
          <EmptyState
            icon="check-circle"
            title="Inga registrerade misstag"
            body="Antingen har du inte tränat området än, eller så har det gått bra. Frågor du missar dyker upp här."
          />
        ) : (
          <div className={page.rows}>
            {mistakes.map((group) => (
              <div className={page.row} key={group.key}>
                <span
                  className={page.rowIcon}
                  style={{
                    backgroundColor: 'var(--color-danger-soft)',
                    color: 'var(--color-danger-strong)',
                  }}
                >
                  {group.count}×
                </span>
                <span>
                  <span className={page.rowTitle}>{group.label}</span>
                  {group.correction && <span className={page.rowMeta}>{group.correction}</span>}
                </span>
                <span />
              </div>
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading">
          <SectionHeading title="Senaste svaren" id="recent-heading" level={3} />
          <div className={page.rows}>
            {recent.map((answer) => (
              <div className={page.row} key={answer.id}>
                <span
                  className={page.rowIcon}
                  style={{
                    backgroundColor: answer.correct
                      ? 'var(--color-success-soft)'
                      : 'var(--color-danger-soft)',
                    color: answer.correct
                      ? 'var(--color-success-strong)'
                      : 'var(--color-danger-strong)',
                  }}
                >
                  <Icon
                    name={answer.correct ? 'check' : 'close'}
                    size={16}
                    label={answer.correct ? 'Rätt' : 'Fel'}
                  />
                </span>
                <span>
                  <span className={page.rowTitle}>{answer.ruleTested}</span>
                  <span className={page.rowMeta}>
                    {new Date(answer.answeredAt).toLocaleDateString('sv-SE', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    {answer.confidence
                      ? ` · ${
                          answer.confidence === 'known'
                            ? 'visste det'
                            : answer.confidence === 'uncertain'
                              ? 'osäker'
                              : 'gissade'
                        }`
                      : ''}
                  </span>
                </span>
                <span />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
