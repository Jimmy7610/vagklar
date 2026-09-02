import { MASTERY } from '@/domain/constants';
import { CATEGORIES, SUBCATEGORY_BY_ID, getCategoryName, getSubcategoryName } from '@/content/taxonomy';
import { COVERED_SUBCATEGORY_IDS, getQuestion } from '@/domain/content/bank';
import { MISCONCEPTION_BY_ID } from '@/content/misconceptions';
import { categoryMastery, isReliable, rankWeakAreas } from '@/domain/mastery/mastery';
import type { CategoryId } from '@/domain/content/types';
import type { AnswerRecord, LearnerData } from '@/domain/learner/types';

/* ------------------------------------------------------------------ */
/* Mistake intelligence                                                */
/* ------------------------------------------------------------------ */

export type MistakeGroupKind = 'misconception' | 'rule';

export interface MistakeGroup {
  key: string;
  kind: MistakeGroupKind;
  /** e.g. "Utfartsregeln vs högerregeln" or "Högerregeln". */
  label: string;
  /** One sentence about the faulty mental model, when we know it. */
  description: string | null;
  /** The correct mental model. */
  correction: string | null;
  subcategoryId: string;
  categoryId: CategoryId | null;
  count: number;
  lastAt: number;
  questionIds: string[];
}

/**
 * Group mistakes by the *mental model* they reveal rather than by question.
 *
 * A mistake tagged with a misconception is grouped under that misconception,
 * so "Utfartsregeln vs högerregeln" collects every wrong answer caused by that
 * particular confusion. Untagged mistakes fall back to the rule under test.
 */
export function groupMistakes(
  answers: readonly AnswerRecord[],
  options: { since?: number; limit?: number } = {},
): MistakeGroup[] {
  const since = options.since ?? 0;
  const groups = new Map<string, MistakeGroup>();

  for (const answer of answers) {
    if (answer.correct || answer.answeredAt < since) continue;

    const misconception = answer.misconceptionId
      ? MISCONCEPTION_BY_ID.get(answer.misconceptionId)
      : undefined;

    const key = misconception ? `m:${misconception.id}` : `r:${answer.subcategory}:${answer.ruleTested}`;
    const existing = groups.get(key);

    if (existing) {
      existing.count += 1;
      existing.lastAt = Math.max(existing.lastAt, answer.answeredAt);
      if (!existing.questionIds.includes(answer.questionId)) {
        existing.questionIds.push(answer.questionId);
      }
      continue;
    }

    const subcategoryId = misconception?.subcategory ?? answer.subcategory;
    groups.set(key, {
      key,
      kind: misconception ? 'misconception' : 'rule',
      label: misconception?.label ?? answer.ruleTested,
      description: misconception?.description ?? null,
      correction: misconception?.correction ?? null,
      subcategoryId,
      categoryId: SUBCATEGORY_BY_ID.get(subcategoryId)?.categoryId ?? null,
      count: 1,
      lastAt: answer.answeredAt,
      questionIds: [answer.questionId],
    });
  }

  const result = Array.from(groups.values()).sort(
    (a, b) => b.count - a.count || b.lastAt - a.lastAt || a.label.localeCompare(b.label),
  );

  return options.limit ? result.slice(0, options.limit) : result;
}

/** Mistakes that are still standing — not yet answered correctly twice since. */
export { outstandingMistakeCount } from './mistakeCount';

/* ------------------------------------------------------------------ */
/* Personal insights                                                   */
/* ------------------------------------------------------------------ */

export type InsightTone = 'positive' | 'neutral' | 'attention';

export interface Insight {
  id: string;
  tone: InsightTone;
  title: string;
  body: string;
  /** Optional deep link target. */
  action?: { label: string; subcategoryId?: string; categoryId?: CategoryId; to?: string };
}

const MIN_OBSERVATIONS_FOR_CLAIM = 6;

/**
 * Insights are generated only from data the learner actually produced.
 * We never invent psychological conclusions, and every claim below is
 * traceable to a concrete counted quantity.
 */
export function buildInsights(data: LearnerData): Insight[] {
  const insights: Insight[] = [];
  const totalAnswers = data.answers.length;

  if (totalAnswers < 5) return insights;

  /* Strongest category ------------------------------------------------ */
  const categorySummaries = CATEGORIES.map((c) => categoryMastery(data.mastery, c.id)).filter(
    (summary) => summary.observations >= MIN_OBSERVATIONS_FOR_CLAIM,
  );

  const strongest = categorySummaries
    .slice()
    .sort((a, b) => b.score - a.score)
    .find((summary) => summary.score >= MASTERY.thresholds.strong);

  if (strongest) {
    insights.push({
      id: `strong-${strongest.categoryId}`,
      tone: 'positive',
      title: `Du är stark på ${getCategoryName(strongest.categoryId).toLowerCase()}`,
      body: `${Math.round(strongest.score * 100)} % behärskning över ${strongest.observations} svar.`,
      action: { label: 'Se området', categoryId: strongest.categoryId },
    });
  }

  /* Clearest weak area ------------------------------------------------ */
  const weakAreas = rankWeakAreas(data.mastery, COVERED_SUBCATEGORY_IDS).filter(
    (area) => isReliable(data.mastery[area.subcategoryId]) && area.score < MASTERY.thresholds.weak,
  );
  const weakest = weakAreas[0];
  if (weakest) {
    insights.push({
      id: `weak-${weakest.subcategoryId}`,
      tone: 'attention',
      title: `${getSubcategoryName(weakest.subcategoryId)} är ditt tydligaste svaga område`,
      body: `${Math.round(weakest.score * 100)} % behärskning efter ${weakest.observations} svar.`,
      action: { label: 'Träna detta', subcategoryId: weakest.subcategoryId },
    });
  }

  /* Improvement over time --------------------------------------------- */
  const improved = Object.values(data.mastery)
    .filter((state) => state.observations >= MIN_OBSERVATIONS_FOR_CLAIM)
    .map((state) => ({ state, delta: state.score - state.previousScore }))
    .sort((a, b) => b.delta - a.delta)[0];

  if (improved && improved.delta >= 0.12) {
    insights.push({
      id: `improved-${improved.state.subcategoryId}`,
      tone: 'positive',
      title: `Du har förbättrat ${getSubcategoryName(improved.state.subcategoryId).toLowerCase()}`,
      body: `Från ${Math.round(improved.state.previousScore * 100)} % till ${Math.round(
        improved.state.score * 100,
      )} %.`,
      action: { label: 'Fortsätt', subcategoryId: improved.state.subcategoryId },
    });
  }

  /* Confidence calibration -------------------------------------------- */
  const tagged = data.answers.filter((a) => a.confidence !== null);
  if (tagged.length >= 12) {
    const uncertainButCorrect = tagged.filter((a) => a.confidence === 'uncertain' && a.correct);
    if (uncertainButCorrect.length >= 6) {
      const bySubcategory = new Map<string, number>();
      for (const answer of uncertainButCorrect) {
        bySubcategory.set(answer.subcategory, (bySubcategory.get(answer.subcategory) ?? 0) + 1);
      }
      const [topSubcategory, count] = Array.from(bySubcategory.entries()).sort(
        (a, b) => b[1] - a[1],
      )[0] ?? ['', 0];
      if (count >= 4 && topSubcategory) {
        insights.push({
          id: `calibration-${topSubcategory}`,
          tone: 'neutral',
          title: 'Du kan mer än du tror',
          body: `Du svarar ofta rätt på ${getSubcategoryName(
            topSubcategory,
          ).toLowerCase()} men markerar dig som osäker.`,
          action: { label: 'Läs regeln', subcategoryId: topSubcategory },
        });
      }
    }

    const confidentlyWrong = tagged.filter((a) => a.confidence === 'known' && !a.correct);
    if (confidentlyWrong.length >= 4) {
      insights.push({
        id: 'calibration-overconfident',
        tone: 'attention',
        title: 'Några regler sitter fel',
        body: `${confidentlyWrong.length} gånger har du varit säker och ändå svarat fel. Det brukar betyda en missuppfattning snarare än en kunskapslucka.`,
        action: { label: 'Se mina misstag', to: '/misstag' },
      });
    }
  }

  /* Repeating misconception ------------------------------------------- */
  const groups = groupMistakes(data.answers, { limit: 1 });
  const topGroup = groups[0];
  if (topGroup && topGroup.count >= 3 && topGroup.kind === 'misconception') {
    insights.push({
      id: `misconception-${topGroup.key}`,
      tone: 'attention',
      title: topGroup.label,
      body: topGroup.correction ?? topGroup.description ?? '',
      action: { label: 'Öva liknande', subcategoryId: topGroup.subcategoryId },
    });
  }

  /* Exam trend --------------------------------------------------------- */
  const completedExams = data.exams
    .filter((e) => e.result)
    .sort((a, b) => (a.submittedAt ?? 0) - (b.submittedAt ?? 0));
  if (completedExams.length >= 2) {
    const last = completedExams[completedExams.length - 1];
    const previous = completedExams[completedExams.length - 2];
    if (last?.result && previous?.result) {
      const delta = last.result.score - previous.result.score;
      if (Math.abs(delta) >= 3) {
        insights.push({
          id: 'exam-trend',
          tone: delta > 0 ? 'positive' : 'attention',
          title: delta > 0 ? 'Provresultatet går uppåt' : 'Provresultatet gick ner',
          body: `Från ${previous.result.score} till ${last.result.score} poäng av ${last.result.scoredQuestions}.`,
          action: { label: 'Se provhistorik', to: '/utveckling' },
        });
      }
    }
  }

  /* Consistency -------------------------------------------------------- */
  if (data.profile.streak.current >= 3) {
    insights.push({
      id: 'streak',
      tone: 'positive',
      title: `${data.profile.streak.current} dagar i rad`,
      body: 'Regelbunden träning ger betydligt bättre resultat än långa enstaka pass.',
    });
  }

  return insights.filter((insight) => insight.body.length > 0).slice(0, 6);
}

/** Whether we know enough about a question to explain the learner's mistake. */
export function explainMistake(questionId: string): string | null {
  const question = getQuestion(questionId);
  if (!question) return null;
  return question.deepExplanation ?? question.shortExplanation;
}

