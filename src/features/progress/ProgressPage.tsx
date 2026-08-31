import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import styles from './ProgressPage.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import {
  Callout,
  EmptyState,
  Pill,
  SectionHeading,
  SegmentedControl,
  Stat,
} from '@/ui/components/Primitives';
import { ProgressRing, masteryColor } from '@/ui/components/ProgressRing';
import { ButtonLink } from '@/ui/components/Button';
import { CATEGORIES } from '@/content/taxonomy';
import { QUESTIONS_BY_CATEGORY, QUESTIONS_BY_SUBCATEGORY } from '@/domain/content/bank';
import { categoryMastery, masteryLevel, MASTERY_LEVEL_LABEL } from '@/domain/mastery/mastery';
import { READINESS_BAND_COPY } from '@/domain/readiness/readiness';
import { useInsights, useLearner, useReadiness } from '@/app/state/useLearner';
import { ACHIEVEMENTS } from '@/domain/achievements/achievements';

type Tab = 'karta' | 'insikter' | 'historik';

const TABS = [
  { value: 'karta' as const, label: 'Kunskapskarta' },
  { value: 'insikter' as const, label: 'Insikter' },
  { value: 'historik' as const, label: 'Historik' },
];

/** Sparkline of readiness over time. Drawn inline; no charting dependency. */
function ReadinessChart({ points }: { points: Array<{ date: string; score: number }> }) {
  if (points.length < 2) return null;

  const width = 320;
  const height = 120;
  const padding = { top: 10, right: 6, bottom: 20, left: 26 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xs = points.map((_, index) =>
    points.length === 1 ? 0 : (index / (points.length - 1)) * innerWidth,
  );
  const ys = points.map((point) => innerHeight - (point.score / 100) * innerHeight);

  const line = points
    .map((_, index) => `${index === 0 ? 'M' : 'L'} ${xs[index]} ${ys[index]}`)
    .join(' ');
  const area = `${line} L ${xs[xs.length - 1]} ${innerHeight} L ${xs[0]} ${innerHeight} Z`;

  const first = points[0];
  const last = points[points.length - 1];

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Provberedskap över tid, från ${first?.score ?? 0} till ${last?.score ?? 0} procent`}
    >
      <g transform={`translate(${padding.left} ${padding.top})`}>
        {[0, 50, 100].map((value) => {
          const y = innerHeight - (value / 100) * innerHeight;
          return (
            <g key={value}>
              <line className={styles.chartGrid} x1={0} y1={y} x2={innerWidth} y2={y} />
              <text className={styles.chartLabel} x={-8} y={y + 3} textAnchor="end">
                {value}
              </text>
            </g>
          );
        })}
        <path className={styles.chartArea} d={area} />
        <path className={styles.chartLine} d={line} />
        {points.map((point, index) => (
          <circle className={styles.chartDot} key={point.date} cx={xs[index]} cy={ys[index]} r={2.4} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Progress.
 *
 * Three views rather than one long scroll: the map (where you stand), the
 * insights (what it means), and the history (how it moved).
 */
export default function ProgressPage() {
  const learner = useLearner();
  const readiness = useReadiness();
  const insights = useInsights();
  const [tab, setTab] = useState<Tab>('karta');

  const hasData = learner.answers.length > 0;
  const bandCopy = READINESS_BAND_COPY[readiness.band];

  const unlocked = useMemo(
    () => new Set(learner.achievements.map((a) => a.id)),
    [learner.achievements],
  );

  const historyPoints = useMemo(
    () => learner.readinessHistory.slice(-30).map((s) => ({ date: s.date, score: s.score })),
    [learner.readinessHistory],
  );

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Utveckling</h1>
        <p className={page.lead}>
          Din behärskning per område, vad Vägklar ser i din träning, och hur det rört sig över tid.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gap: 'var(--space-5)',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          alignItems: 'center',
          padding: 'var(--space-5)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        <ProgressRing
          value={readiness.score}
          size={116}
          thickness={9}
          label="Beredskap"
          valueFontSize="2rem"
        />
        <div>
          <h2 style={{ fontSize: 'var(--text-subsection)', margin: '0 0 var(--space-2)' }}>
            {bandCopy.label}
          </h2>
          <p
            style={{
              fontSize: 'var(--text-small)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            {bandCopy.message}
          </p>
          {readiness.provisional && readiness.score !== null && (
            <div style={{ marginTop: 'var(--space-3)' }}>
              <Pill tone="warning" icon="info">
                Preliminär — bygger på {readiness.answeredTotal} svar
              </Pill>
            </div>
          )}
        </div>
      </section>

      <SegmentedControl options={TABS} value={tab} onChange={setTab} ariaLabel="Visa" />

      {/* ---- Knowledge map ------------------------------------------------ */}
      {tab === 'karta' && (
        <section aria-label="Kunskapskarta" className={styles.mapGrid}>
          {CATEGORIES.map((category) => {
            const summary = categoryMastery(learner.mastery, category.id);
            const percent = Math.round(summary.score * 100);
            const questions = QUESTIONS_BY_CATEGORY.get(category.id) ?? [];
            const subcategories = Array.from(new Set(questions.map((q) => q.subcategory)));

            return (
              <article className={styles.categoryCard} key={category.id}>
                <div className={styles.categoryHead}>
                  <span className={styles.categoryIcon}>
                    <Icon name={category.icon as IconName} size={18} />
                  </span>
                  <span>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categorySub}>
                      {summary.startedSubcategories} av {summary.totalSubcategories} delområden
                      påbörjade
                    </span>
                  </span>
                  <span
                    className={styles.categoryValue}
                    style={{ color: masteryColor(summary.observations > 0 ? percent : null) }}
                  >
                    {summary.observations > 0 ? `${percent}%` : '—'}
                  </span>
                </div>

                <div className={styles.subList}>
                  {subcategories.map((subcategoryId) => {
                    const state = learner.mastery[subcategoryId];
                    const subPercent = Math.round((state?.score ?? 0) * 100);
                    const level = masteryLevel(state);
                    const name =
                      category.subcategories.find((s) => s.id === subcategoryId)?.name ??
                      subcategoryId;
                    const count = QUESTIONS_BY_SUBCATEGORY.get(subcategoryId)?.length ?? 0;

                    return (
                      <Link
                        key={subcategoryId}
                        to={`/utveckling/omrade/${subcategoryId}`}
                        className={styles.subRow}
                      >
                        <span className={styles.subName}>{name}</span>
                        <span
                          className={styles.subValue}
                          style={{
                            color: masteryColor(state?.observations ? subPercent : null),
                          }}
                        >
                          {state?.observations ? `${subPercent}%` : '—'}
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--text-caption)',
                            color: 'var(--color-text-tertiary)',
                          }}
                        >
                          {level === 'untouched' ? `${count} frågor` : MASTERY_LEVEL_LABEL[level]}
                        </span>
                        <span className={styles.subBar}>
                          <span
                            className={styles.subBarFill}
                            style={{
                              width: `${subPercent}%`,
                              backgroundColor: masteryColor(state?.observations ? subPercent : null),
                            }}
                          />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* ---- Insights ------------------------------------------------------ */}
      {tab === 'insikter' && (
        <section aria-label="Insikter" className={page.stack}>
          {insights.length === 0 ? (
            <EmptyState
              icon="lightbulb"
              title="För lite data än"
              body="Vägklar drar bara slutsatser som går att belägga med din egen träning. Svara på fler frågor så växer bilden fram."
            />
          ) : (
            insights.map((insight) => (
              <div className={page.panel} key={insight.id}>
                <h3 className={page.panelTitle}>{insight.title}</h3>
                <p
                  style={{
                    fontSize: 'var(--text-small)',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 var(--space-3)',
                  }}
                >
                  {insight.body}
                </p>
                {insight.action?.subcategoryId && (
                  <ButtonLink
                    to={`/utveckling/omrade/${insight.action.subcategoryId}`}
                    variant="soft"
                    size="sm"
                  >
                    {insight.action.label}
                  </ButtonLink>
                )}
                {insight.action?.to && (
                  <ButtonLink to={insight.action.to} variant="soft" size="sm">
                    {insight.action.label}
                  </ButtonLink>
                )}
              </div>
            ))
          )}

          <div className={page.panel}>
            <h3 className={page.panelTitle}>Så räknas provberedskapen</h3>
            <p
              style={{
                fontSize: 'var(--text-small)',
                color: 'var(--color-text-secondary)',
                margin: '0 0 var(--space-4)',
              }}
            >
              Sju delar vägs samman. Delar som inte går att mäta än hoppas över, och resten viktas
              om — du straffas alltså inte för något du inte hunnit göra.
            </p>

            {readiness.components.map((component) => (
              <div className={styles.componentRow} key={component.key}>
                <div>
                  <div className={styles.componentName}>{component.label}</div>
                  <div className={styles.componentDesc}>{component.description}</div>
                </div>
                <div className={styles.componentValue}>
                  {component.value === null ? (
                    <span className={styles.unavailable}>Ingen data</span>
                  ) : (
                    `${Math.round(component.value * 100)}%`
                  )}
                </div>
                <div className={styles.componentBar}>
                  <div
                    className={styles.componentFill}
                    style={{ width: `${(component.value ?? 0) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            {readiness.penalties.some((p) => p.amount > 0) && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                {readiness.penalties
                  .filter((p) => p.amount > 0)
                  .map((penalty) => (
                    <Callout tone="warning" key={penalty.key}>
                      <strong>{penalty.label}:</strong> {penalty.detail} (−
                      {Math.round(penalty.amount * 100)} p)
                    </Callout>
                  ))}
              </div>
            )}

            <p className={page.mutedNote} style={{ marginTop: 'var(--space-4)' }}>
              Provberedskapen är Vägklars egen uppskattning av hur väl förberedd du är. Den är inte
              en sannolikhet att bli godkänd på det riktiga kunskapsprovet.
            </p>
          </div>
        </section>
      )}

      {/* ---- History -------------------------------------------------------- */}
      {tab === 'historik' && (
        <section aria-label="Historik" className={page.stack}>
          {historyPoints.length >= 2 ? (
            <div className={page.panel}>
              <h3 className={page.panelTitle}>Provberedskap över tid</h3>
              <ReadinessChart points={historyPoints} />
            </div>
          ) : (
            <EmptyState
              icon="trend"
              title="Kurvan börjar snart"
              body="Efter ett par träningsdagar kan vi visa hur din provberedskap rör sig."
            />
          )}

          {hasData && (
            <div className={page.panel}>
              <h3 className={page.panelTitle}>Totalt</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                <Stat value={learner.profile.totals.answered} label="Svar" size="1.5rem" />
                <Stat
                  value={learner.profile.totals.sessionsCompleted}
                  label="Pass"
                  size="1.5rem"
                />
                <Stat value={learner.profile.totals.examAttempts} label="Prov" size="1.5rem" />
                <Stat value={learner.profile.totals.examsPassed} label="Godkända" size="1.5rem" />
                <Stat value={learner.profile.streak.longest} label="Längsta svit" size="1.5rem" />
              </div>
            </div>
          )}

          <div className={page.panel}>
            <h3 className={page.panelTitle}>Milstolpar</h3>
            <div className={page.rows}>
              {ACHIEVEMENTS.map((achievement) => {
                const earned = unlocked.has(achievement.id);
                return (
                  <div className={page.row} key={achievement.id}>
                    <span
                      className={page.rowIcon}
                      style={
                        earned
                          ? {
                              backgroundColor: 'var(--color-success-soft)',
                              color: 'var(--color-success-strong)',
                            }
                          : undefined
                      }
                    >
                      <Icon name={earned ? 'check' : (achievement.icon as IconName)} size={17} />
                    </span>
                    <span>
                      <span className={page.rowTitle}>{achievement.title}</span>
                      <span className={page.rowMeta}>{achievement.description}</span>
                    </span>
                    {earned ? <Pill tone="success">Klar</Pill> : <span />}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SectionHeading title="Vill du träna direkt?" level={3} />
      <div className={page.actions}>
        <ButtonLink to="/trana" icon="practice">
          Till träningen
        </ButtonLink>
        <ButtonLink to="/misstag" variant="secondary" icon="refresh">
          Mina misstag
        </ButtonLink>
      </div>
    </div>
  );
}
