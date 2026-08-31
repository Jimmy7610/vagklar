import page from '@/features/shared/Page.module.css';
import { Link } from 'react-router-dom';
import { Icon } from '@/ui/icons/Icon';
import type { IconName } from '@/ui/icons/Icon';
import { Meter, Pill, SectionHeading } from '@/ui/components/Primitives';
import { LESSONS } from '@/content/lessons';
import { CATEGORY_BY_ID } from '@/content/taxonomy';
import { useLearner } from '@/app/state/useLearner';

/**
 * Theory school index.
 *
 * Lessons are resumable: progress is stored per lesson, and the card shows how
 * far the learner got rather than just done/not done.
 */
export default function TheoryPage() {
  const learner = useLearner();

  const completed = LESSONS.filter((l) => learner.lessons[l.id]?.completedAt).length;

  return (
    <div className={page.page}>
      <header className={page.header}>
        <h1 className={page.title}>Teoriskola</h1>
        <p className={page.lead}>
          Korta lektioner som förklarar reglerna och varför de ser ut som de gör. Varje lektion
          avslutas med några frågor som räknas in i din utveckling.
        </p>
      </header>

      <div className={page.panel}>
        <Meter
          value={completed}
          max={LESSONS.length}
          label="Genomgångna lektioner"
          valueText={`${completed} av ${LESSONS.length}`}
          height={8}
        />
      </div>

      <section aria-labelledby="lessons-heading">
        <SectionHeading title="Lektioner" id="lessons-heading" />
        <div className={page.rows}>
          {LESSONS.map((lesson) => {
            const progress = learner.lessons[lesson.id];
            const isComplete = Boolean(progress?.completedAt);
            const started = Boolean(progress && !isComplete);
            const category = CATEGORY_BY_ID.get(lesson.categoryId);

            return (
              <Link key={lesson.id} to={`/teori/${lesson.id}`} className={page.row}>
                <span
                  className={page.rowIcon}
                  style={
                    isComplete
                      ? {
                          backgroundColor: 'var(--color-success-soft)',
                          color: 'var(--color-success-strong)',
                        }
                      : undefined
                  }
                >
                  <Icon
                    name={isComplete ? 'check' : ((category?.icon ?? 'book') as IconName)}
                    size={17}
                  />
                </span>
                <span>
                  <span className={page.rowTitle}>{lesson.title}</span>
                  <span className={page.rowMeta}>
                    {lesson.summary} · {lesson.estimatedMinutes} min
                  </span>
                </span>
                {isComplete ? (
                  <Pill tone="success">Klar</Pill>
                ) : started ? (
                  <Pill tone="warning">Påbörjad</Pill>
                ) : (
                  <span className={page.chevron}>
                    <Icon name="chevron-right" size={18} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
