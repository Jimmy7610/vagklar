import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, EmptyState, Pill, SegmentedControl } from '@/ui/components/Primitives';
import { Modal } from '@/ui/components/Modal';
import { getSubcategoryName } from '@/content/taxonomy';
import { getQuestion, siblingQuestions } from '@/domain/content/bank';
import type { MistakeGroup } from '@/domain/insights/insights';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import { useMistakeGroups, useSelectionContext } from '@/app/state/useContent';
import { buildQuickSession, mistakePool, assemble } from '@/domain/selection/selection';

type Sort = 'frequency' | 'recent';

const SORTS = [
  { value: 'frequency' as const, label: 'Vanligast' },
  { value: 'recent' as const, label: 'Senaste' },
];

function relativeDate(timestamp: number): string {
  const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
  if (days <= 0) return 'idag';
  if (days === 1) return 'igår';
  if (days < 7) return `för ${days} dagar sedan`;
  if (days < 30) return `för ${Math.floor(days / 7)} veckor sedan`;
  return new Date(timestamp).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

/**
 * Mistake replay.
 *
 * Not a list of wrong answers: mistakes are grouped by the mental model they
 * reveal, so a learner works on the cause rather than memorising individual
 * items. "Öva liknande" deliberately picks a *different* question about the
 * same rule.
 */
export default function MistakesPage() {
  const groups = useMistakeGroups();
  const learner = useLearner();
  const actions = useLearnerActions();
  const context = useSelectionContext();
  const navigate = useNavigate();
  const [sort, setSort] = useState<Sort>('frequency');
  const [detail, setDetail] = useState<MistakeGroup | null>(null);

  const outstanding = useMemo(() => mistakePool(context).length, [context]);

  const sorted = useMemo(() => {
    const copy = groups.slice();
    if (sort === 'recent') copy.sort((a, b) => b.lastAt - a.lastAt);
    return copy;
  }, [groups, sort]);

  const startAll = () => {
    const candidates = mistakePool(context);
    const questions = assemble(candidates, { size: 10, seed: context.seed, maxPerSubcategory: 4 });
    if (questions.length === 0) return;
    const started = actions.startSession({
      mode: 'mistakes',
      label: 'Mina misstag',
      questionIds: questions.map((q) => q.id),
    });
    if (started) navigate('/trana/pass');
  };

  const retryGroup = (group: MistakeGroup) => {
    const questions = group.questionIds.flatMap((id) => {
      const question = getQuestion(id);
      return question ? [question] : [];
    });
    if (questions.length === 0) return;
    const started = actions.startSession({
      mode: 'mistakes',
      label: group.label,
      questionIds: questions.map((q) => q.id),
    });
    if (started) navigate('/trana/pass');
  };

  /** Practise the same rule with questions the learner has *not* just seen. */
  const practiseSimilar = (group: MistakeGroup) => {
    const seen = new Set(group.questionIds);
    const siblings = group.questionIds
      .flatMap((id) => {
        const question = getQuestion(id);
        return question ? siblingQuestions(question) : [];
      })
      .filter((question) => !seen.has(question.id));

    const unique = Array.from(new Map(siblings.map((q) => [q.id, q])).values());
    const questions =
      unique.length >= 3
        ? unique.slice(0, 8)
        : buildQuickSession(context, 8, { kind: 'subcategory', subcategoryId: group.subcategoryId });

    if (questions.length === 0) return;
    const started = actions.startSession({
      mode: 'training',
      label: `Liknande: ${group.label}`,
      questionIds: questions.map((q) => q.id),
    });
    if (started) navigate('/trana/pass');
  };

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Mina misstag</h1>
        <p className={page.lead}>
          Grupperade efter vilken feltanke de avslöjar, inte efter enskilda frågor. Det är mönstret
          du behöver träna bort.
        </p>
      </header>

      {groups.length === 0 ? (
        <EmptyState
          icon="check-circle"
          title="Bra början"
          body="Frågor du missar samlas här så att du kan träna på dem igen — grupperade efter vad felet berodde på."
          action={
            <ButtonLink to="/trana" variant="soft">
              Börja träna
            </ButtonLink>
          }
        />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <SegmentedControl
              options={SORTS}
              value={sort}
              onChange={setSort}
              ariaLabel="Sortera misstag"
            />
            <Button onClick={startAll} disabled={outstanding === 0} icon="refresh">
              Testa alla igen
            </Button>
          </div>

          {outstanding > 0 && (
            <Callout tone="info">
              {outstanding} {outstanding === 1 ? 'fråga' : 'frågor'} räknas fortfarande som olöst.
              En fråga lämnar listan när du svarat rätt på den två gånger i rad.
            </Callout>
          )}

          <div className={page.rows}>
            {sorted.map((group) => (
              <button
                key={group.key}
                type="button"
                className={page.row}
                onClick={() => setDetail(group)}
              >
                <span
                  className={page.rowIcon}
                  style={{
                    backgroundColor: 'var(--color-danger-soft)',
                    color: 'var(--color-danger-strong)',
                    fontWeight: 700,
                    fontSize: 'var(--text-caption)',
                  }}
                >
                  {group.count}×
                </span>
                <span>
                  <span className={page.rowTitle}>{group.label}</span>
                  <span className={page.rowMeta}>
                    {getSubcategoryName(group.subcategoryId)} · senast {relativeDate(group.lastAt)}
                  </span>
                </span>
                <span className={page.chevron}>
                  <Icon name="chevron-right" size={18} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.label ?? ''}
        description={
          detail ? `${detail.count} gånger · ${getSubcategoryName(detail.subcategoryId)}` : undefined
        }
        footer={
          detail ? (
            <>
              <Button variant="secondary" onClick={() => practiseSimilar(detail)}>
                Öva liknande
              </Button>
              <Button onClick={() => retryGroup(detail)}>Testa igen</Button>
            </>
          ) : undefined
        }
      >
        {detail && (
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {detail.kind === 'misconception' ? (
              <Pill tone="warning" icon="alert">
                Återkommande feltanke
              </Pill>
            ) : (
              <Pill tone="neutral">Regel: {detail.label}</Pill>
            )}

            {detail.description && (
              <div>
                <h3 style={{ fontSize: 'var(--text-small)', marginBottom: 'var(--space-1)' }}>
                  Vad som brukar hända
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
                  {detail.description}
                </p>
              </div>
            )}

            {detail.correction && (
              <div>
                <h3 style={{ fontSize: 'var(--text-small)', marginBottom: 'var(--space-1)' }}>
                  Så ligger det till
                </h3>
                <p style={{ fontSize: 'var(--text-small)', color: 'var(--color-text-secondary)' }}>
                  {detail.correction}
                </p>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: 'var(--text-small)', marginBottom: 'var(--space-2)' }}>
                Frågor du missat
              </h3>
              <ul style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {detail.questionIds.slice(0, 5).map((id) => {
                  const question = getQuestion(id);
                  if (!question) return null;
                  const state = learner.questionStates[id];
                  return (
                    <li
                      key={id}
                      style={{
                        fontSize: 'var(--text-small)',
                        color: 'var(--color-text-secondary)',
                        paddingBottom: 'var(--space-3)',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      {question.prompt}
                      {state && state.streak >= 2 && (
                        <div style={{ marginTop: 'var(--space-2)' }}>
                          <Pill tone="success" icon="check">
                            Rättad
                          </Pill>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
