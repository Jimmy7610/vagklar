import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PracticePage.module.css';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import { SectionHeading, SegmentedControl, Pill } from '@/ui/components/Primitives';
import { masteryColor } from '@/ui/components/ProgressRing';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import { useSelectionContext } from '@/app/state/useContent';
import {
  buildDailyTen,
  buildQuickSession,
  duePool,
  mistakePool,
} from '@/domain/selection/selection';
import type { QuickFilter } from '@/domain/selection/selection';
import { CATEGORIES } from '@/content/taxonomy';
import { QUESTIONS_BY_CATEGORY } from '@/domain/content/bank';
import { categoryMastery } from '@/domain/mastery/mastery';
import { SESSION } from '@/domain/constants';
import { useUi } from '@/app/state/UiProvider';

const SIZE_OPTIONS = SESSION.quickSizes.map((size) => ({
  value: String(size) as '5' | '10' | '20',
  label: `${size} frågor`,
}));

/**
 * The training hub.
 *
 * Every entry point produces a session through the same selection engine —
 * the difference is only which candidate pool it draws from.
 */
export default function PracticePage() {
  const learner = useLearner();
  const actions = useLearnerActions();
  const context = useSelectionContext();
  const navigate = useNavigate();
  const { toast } = useUi();
  const [size, setSize] = useState<'5' | '10' | '20'>('10');

  const dueCount = useMemo(() => duePool(context).length, [context]);
  const mistakeCount = useMemo(() => mistakePool(context).length, [context]);
  const savedCount = useMemo(
    () => Object.values(learner.questionStates).filter((s) => s.saved).length,
    [learner.questionStates],
  );

  const start = (label: string, filter: QuickFilter, mode: 'quick' | 'review' | 'mistakes') => {
    const questions = buildQuickSession(context, Number(size), filter);
    if (questions.length === 0) {
      toast('Det finns inga frågor i den här kategorin just nu.', { tone: 'warning' });
      return;
    }
    const started = actions.startSession({
      mode,
      label,
      questionIds: questions.map((q) => q.id),
      categoryId: filter.kind === 'category' ? filter.categoryId : null,
    });
    if (started) navigate('/trana/pass');
  };

  const startDailyTen = () => {
    const questions = buildDailyTen(context);
    const started = actions.startSession({
      mode: 'daily-ten',
      label: 'Dagens 10',
      questionIds: questions.map((q) => q.id),
    });
    if (started) navigate('/trana/pass');
  };

  const modes: Array<{
    icon: IconName;
    title: string;
    meta: string;
    disabled?: boolean;
    onClick: () => void;
  }> = [
    {
      icon: 'sparkle',
      title: 'Dagens 10',
      meta: 'Personligt blandat pass',
      onClick: startDailyTen,
    },
    {
      icon: 'grid',
      title: 'Blanda allt',
      meta: `${size} frågor från hela teorin`,
      onClick: () => start('Blandad träning', { kind: 'all' }, 'quick'),
    },
    {
      icon: 'target',
      title: 'Mina svaga områden',
      meta: 'Där behärskningen är lägst',
      onClick: () => start('Svaga områden', { kind: 'weak' }, 'quick'),
    },
    {
      icon: 'refresh',
      title: 'Mina misstag',
      meta: mistakeCount > 0 ? `${mistakeCount} att ta igen` : 'Inget olöst just nu',
      disabled: mistakeCount === 0,
      onClick: () => start('Mina misstag', { kind: 'mistakes' }, 'mistakes'),
    },
    {
      icon: 'clock',
      title: 'Behöver repeteras',
      meta: dueCount > 0 ? `${dueCount} mogna för repetition` : 'Inget förfaller just nu',
      disabled: dueCount === 0,
      onClick: () => start('Repetition', { kind: 'due' }, 'review'),
    },
    {
      icon: 'bookmark',
      title: 'Sparade frågor',
      meta: savedCount > 0 ? `${savedCount} sparade` : 'Du har inte sparat någon fråga än',
      disabled: savedCount === 0,
      onClick: () => start('Sparade frågor', { kind: 'saved' }, 'quick'),
    },
  ];

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Träna</h1>
        <p className={styles.lead}>
          Välj hur du vill träna. Vägklar plockar frågorna utifrån var du står just nu — även när du
          väljer en kategori själv.
        </p>
      </header>

      <section aria-labelledby="quick-heading">
        <SectionHeading title="Snabbträning" id="quick-heading" />
        <div className={styles.sizeRow}>
          <span className={styles.sizeLabel}>Passets längd</span>
          <SegmentedControl
            options={SIZE_OPTIONS}
            value={size}
            onChange={setSize}
            ariaLabel="Antal frågor i passet"
          />
        </div>

        <div className={styles.modeGrid}>
          {modes.map((mode) => (
            <button
              key={mode.title}
              type="button"
              className={styles.mode}
              onClick={mode.onClick}
              disabled={mode.disabled}
            >
              <span className={styles.modeIcon}>
                <Icon name={mode.icon} size={19} />
              </span>
              <span>
                <span className={styles.modeTitle}>{mode.title}</span>
                <span className={styles.modeMeta}>{mode.meta}</span>
              </span>
              <span className={styles.modeChevron}>
                <Icon name="chevron-right" size={18} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <SectionHeading
          title="Kunskapsområden"
          id="categories-heading"
          action={{ label: 'Kunskapskarta', to: '/utveckling' }}
        />
        <div className={styles.categoryList}>
          {CATEGORIES.map((category) => {
            const summary = categoryMastery(learner.mastery, category.id);
            const questionCount = QUESTIONS_BY_CATEGORY.get(category.id)?.length ?? 0;
            const percent = Math.round(summary.score * 100);
            const started = summary.observations > 0;

            return (
              <button
                key={category.id}
                type="button"
                className={styles.category}
                onClick={() =>
                  start(category.name, { kind: 'category', categoryId: category.id }, 'quick')
                }
              >
                <span className={styles.categoryIcon}>
                  <Icon name={category.icon as IconName} size={17} />
                </span>
                <span>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryMeta}>
                    {questionCount} frågor · {summary.startedSubcategories}/
                    {summary.totalSubcategories} delområden påbörjade
                  </span>
                </span>
                {started ? (
                  <span className={styles.categoryValue} style={{ color: masteryColor(percent) }}>
                    {percent}%
                  </span>
                ) : (
                  <Pill tone="outline">Ny</Pill>
                )}
                <span className={styles.modeChevron}>
                  <Icon name="chevron-right" size={18} />
                </span>
                <span className={styles.categoryBar}>
                  <span
                    className={styles.categoryBarFill}
                    style={{
                      width: `${percent}%`,
                      backgroundColor: masteryColor(started ? percent : null),
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
