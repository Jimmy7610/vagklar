import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import page from '@/features/shared/Page.module.css';
import styles from './LessonPage.module.css';
import { Button, ButtonLink } from '@/ui/components/Button';
import { Icon } from '@/ui/icons/Icon';
import { Callout, SectionHeading } from '@/ui/components/Primitives';
import { ScenarioStage } from '@/ui/illustrations/ScenarioStage';
import { SourceImageFigure } from '@/ui/media/SourceImageFigure';
import { LESSONS, getLesson } from '@/content/lessons';
import { SCENARIOS } from '@/content/scenarios';
import { getQuestions } from '@/domain/content/bank';
import { getCategoryName } from '@/content/taxonomy';
import { CHAPTER_BY_ID } from '@/content/curriculum/curriculum';
import { getSource, PRIMARY_SOURCE_ID } from '@/content/sources';
import { useLearner, useLearnerActions } from '@/app/state/useLearner';
import type { LessonBlock } from '@/domain/content/types';

function Block({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className={styles.paragraph}>{block.text}</p>;
    case 'rule':
      return (
        <div className={styles.rule}>
          <h3 className={styles.ruleTitle}>{block.title}</h3>
          <p className={styles.ruleText}>{block.text}</p>
        </div>
      );
    case 'list':
      return (
        <div>
          {block.title && <h3 className={styles.listTitle}>{block.title}</h3>}
          <ul className={styles.list}>
            {block.items.map((item) => (
              <li className={styles.listItem} key={item}>
                <span className={styles.bullet} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    case 'example':
      return (
        <div className={styles.example}>
          <h3 className={styles.exampleTitle}>{block.title}</h3>
          <p className={styles.exampleText}>{block.text}</p>
        </div>
      );
    case 'memory':
      return (
        <p className={styles.memory}>
          <Icon name="lightbulb" size={20} />
          {block.text}
        </p>
      );
    case 'warning':
      return <Callout tone="warning">{block.text}</Callout>;
    case 'illustration': {
      // Lessons reference scenario layouts by key so they reuse the same
      // rendering the Scenario Lab uses.
      const scenario = SCENARIOS.find((s) => s.layout === block.illustration) ?? SCENARIOS[0];
      if (!scenario) return null;
      return (
        <figure className={styles.illustrationBox}>
          <ScenarioStage scenario={scenario} revealed />
          {block.caption && <figcaption className={styles.caption}>{block.caption}</figcaption>}
        </figure>
      );
    }
    case 'sourceImage':
      return (
        <SourceImageFigure
          imageId={block.imageId}
          {...(block.prompt ? { prompt: block.prompt } : {})}
          {...(block.caption ? { caption: block.caption } : {})}
          sizes="(min-width: 1024px) 640px, 100vw"
        />
      );
    default:
      return null;
  }
}

/**
 * A single lesson.
 *
 * A comfortable reading column with an optional section navigator on wide
 * screens. Progress is recorded as the learner scrolls so the lesson is
 * genuinely resumable.
 */
export default function LessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const learner = useLearner();
  const actions = useLearnerActions();
  const navigate = useNavigate();
  const [activeBlock, setActiveBlock] = useState(0);

  const questions = useMemo(
    () => (lesson ? getQuestions(lesson.checkQuestionIds) : []),
    [lesson],
  );

  const progress = lessonId ? learner.lessons[lessonId] : undefined;

  // Mark the lesson as started once.
  useEffect(() => {
    if (!lessonId || progress) return;
    actions.updateLessonProgress(lessonId, { startedAt: Date.now() });
  }, [lessonId, progress, actions]);

  // Track the furthest heading the learner reached.
  useEffect(() => {
    if (!lesson) return;
    const handler = () => {
      const marks = Array.from(document.querySelectorAll<HTMLElement>('[data-block-index]'));
      let current = 0;
      for (const mark of marks) {
        if (mark.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = Number(mark.dataset.blockIndex ?? 0);
        }
      }
      setActiveBlock(current);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [lesson]);

  useEffect(() => {
    if (!lessonId || !progress) return;
    if (activeBlock > (progress.furthestBlock ?? 0)) {
      actions.updateLessonProgress(lessonId, { furthestBlock: activeBlock });
    }
  }, [activeBlock, lessonId, progress, actions]);

  if (!lesson || !lessonId) return <Navigate to="/teori" replace />;

  const index = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[index + 1];
  const isComplete = Boolean(progress?.completedAt);

  const startCheck = () => {
    if (questions.length === 0) return;
    const started = actions.startSession({
      mode: 'lesson-check',
      label: `${lesson.title} — kontrollfrågor`,
      questionIds: questions.map((q) => q.id),
      categoryId: lesson.categoryId,
    });
    if (started) {
      actions.updateLessonProgress(lessonId, { completedAt: Date.now(), checkPassed: true });
      navigate('/trana/pass');
    }
  };

  const chapters = lesson.curriculumChapterIds
    .map((id) => CHAPTER_BY_ID.get(id))
    .filter((chapter) => chapter !== undefined);
  const source = getSource(PRIMARY_SOURCE_ID);

  const navigable = lesson.blocks
    .map((block, blockIndex) => ({ block, blockIndex }))
    .filter(({ block }) => block.kind === 'rule' || block.kind === 'list' || block.kind === 'example');

  return (
    <div className={page.page}>
      <header className={page.header}>
        <Link to="/teori" className={page.backLink}>
          <Icon name="chevron-left" size={16} />
          Teoriskolan
        </Link>
        <h1 className={page.title}>{lesson.title}</h1>
        <p className={page.lead}>
          {getCategoryName(lesson.categoryId)} · {lesson.estimatedMinutes} min läsning
        </p>
      </header>

      <div className={styles.layout}>
        <article className={styles.article}>
          <div className={styles.blocks}>
            {lesson.blocks.map((block, blockIndex) => (
              <div key={blockIndex} data-block-index={blockIndex} id={`block-${blockIndex}`}>
                <Block block={block} />
              </div>
            ))}
          </div>

          <section className={styles.check}>
            <SectionHeading
              overline="Kontroll"
              title="Sitter det?"
              level={2}
            />
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {questions.length} frågor om det du just läst. Svaren räknas in i din utveckling som
              vanligt.
            </p>
            <div className={page.actions}>
              <Button size="lg" onClick={startCheck} disabled={questions.length === 0}>
                {isComplete ? 'Kör kontrollen igen' : 'Kör kontrollfrågorna'}
              </Button>
              {next && (
                <ButtonLink to={`/teori/${next.id}`} size="lg" variant="secondary" iconAfter="arrow-right">
                  Nästa lektion
                </ButtonLink>
              )}
            </div>
          </section>
        </article>

        <aside className={styles.aside}>
          {chapters.length > 0 && (
            <section className={styles.curriculum} aria-labelledby="lesson-curriculum">
              <div className={styles.asideTitle} id="lesson-curriculum">
                I kursplanen
              </div>
              <ul className={styles.curriculumList}>
                {chapters.map((chapter) => (
                  <li key={chapter.id} className={styles.curriculumItem}>
                    <span className={styles.curriculumTitle}>{chapter.title}</span>
                    <span className={styles.curriculumPages}>
                      s. {chapter.startPage}–{chapter.endPage}
                    </span>
                  </li>
                ))}
              </ul>
              {source && (
                <p className={styles.curriculumSource}>
                  Sidhänvisningarna avser {source.title} ({source.edition}), {source.publisher} — ©{' '}
                  {source.rightsHolder}. Texten här är skriven av Vägklar.{' '}
                  <Link to="/kallor" className={styles.curriculumLink}>
                    Källor och rättigheter
                  </Link>
                </p>
              )}
            </section>
          )}
          <div className={styles.asideTitle}>I den här lektionen</div>
          <nav className={styles.asideList} aria-label="Lektionens delar">
            {navigable.map(({ block, blockIndex }) => {
              const label =
                block.kind === 'rule'
                  ? block.title
                  : block.kind === 'list'
                    ? (block.title ?? 'Lista')
                    : block.kind === 'example'
                      ? block.title
                      : '';
              return (
                <a
                  key={blockIndex}
                  href={`#block-${blockIndex}`}
                  className={[
                    styles.asideLink,
                    activeBlock >= blockIndex ? styles.asideActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
