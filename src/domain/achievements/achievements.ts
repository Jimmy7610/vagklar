import { MASTERY } from '@/domain/constants';
import { CATEGORIES } from '@/content/taxonomy';
import { categoryMastery } from '@/domain/mastery/mastery';
import type { LearnerData } from '@/domain/learner/types';

/**
 * Achievements.
 *
 * Deliberately restrained: milestones that reflect real competence, no coins,
 * no streaks-as-pressure, no mascots. They are recognition, not a currency.
 */

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Returns true when the achievement is earned. Pure. */
  isEarned: (data: LearnerData) => boolean;
}

function masteredCategories(data: LearnerData): number {
  return CATEGORIES.filter((category) => {
    const summary = categoryMastery(data.mastery, category.id);
    return summary.totalSubcategories > 0 && summary.score >= MASTERY.thresholds.strong;
  }).length;
}

function categoriesAbove(data: LearnerData, threshold: number): number {
  return CATEGORIES.filter((category) => {
    const summary = categoryMastery(data.mastery, category.id);
    return summary.totalSubcategories > 0 && summary.score >= threshold;
  }).length;
}

function passedExamStreak(data: LearnerData): number {
  const completed = data.exams
    .filter((e) => e.result !== null)
    .sort((a, b) => (a.submittedAt ?? 0) - (b.submittedAt ?? 0));
  let streak = 0;
  for (let i = completed.length - 1; i >= 0; i -= 1) {
    if (completed[i]?.result?.passed) streak += 1;
    else break;
  }
  return streak;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-session',
    title: 'Första passet',
    description: 'Du genomförde ditt första träningspass.',
    icon: 'flag',
    isEarned: (data) => data.profile.totals.sessionsCompleted >= 1,
  },
  {
    id: 'hundred-questions',
    title: '100 frågor',
    description: 'Hundra besvarade frågor. Grunden är lagd.',
    icon: 'stack',
    isEarned: (data) => data.profile.totals.answered >= 100,
  },
  {
    id: 'five-hundred-questions',
    title: '500 frågor',
    description: 'Femhundra besvarade frågor.',
    icon: 'stack',
    isEarned: (data) => data.profile.totals.answered >= 500,
  },
  {
    id: 'first-exam-pass',
    title: 'Första godkända provet',
    description: 'Du klarade en provsimulering för första gången.',
    icon: 'check-circle',
    isEarned: (data) => data.profile.totals.examsPassed >= 1,
  },
  {
    id: 'three-exams-in-row',
    title: 'Tre godkända prov i rad',
    description: 'Tre provsimuleringar i följd över godkäntgränsen.',
    icon: 'trend',
    isEarned: (data) => passedExamStreak(data) >= 3,
  },
  {
    id: 'category-mastered',
    title: 'Behärskat område',
    description: 'Ett helt kunskapsområde över 85 %.',
    icon: 'target',
    isEarned: (data) => masteredCategories(data) >= 1,
  },
  {
    id: 'all-categories-70',
    title: 'Alla områden över 70 %',
    description: 'Ingen svag punkt kvar i något område.',
    icon: 'map',
    isEarned: (data) => categoriesAbove(data, MASTERY.thresholds.developing) === CATEGORIES.length,
  },
  {
    id: 'week-streak',
    title: 'Sju dagar i rad',
    description: 'En hel vecka med träning varje dag.',
    icon: 'calendar',
    isEarned: (data) => data.profile.streak.longest >= 7,
  },
  {
    id: 'mistakes-cleared',
    title: 'Rensat bland misstagen',
    description: 'Du har rättat till minst 20 frågor du tidigare svarade fel på.',
    icon: 'refresh',
    isEarned: (data) => {
      const wrong = new Set(data.answers.filter((a) => !a.correct).map((a) => a.questionId));
      let fixed = 0;
      for (const questionId of wrong) {
        if ((data.questionStates[questionId]?.streak ?? 0) >= 2) fixed += 1;
      }
      return fixed >= 20;
    },
  },
  {
    id: 'lessons-complete',
    title: 'Genomgången teori',
    description: 'Alla lektioner i teoriskolan avklarade.',
    icon: 'book',
    isEarned: (data) => {
      const completed = Object.values(data.lessons).filter((l) => l.completedAt !== null).length;
      return completed >= 8;
    },
  },
];

export const ACHIEVEMENT_BY_ID: ReadonlyMap<string, AchievementDefinition> = new Map(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

/** Achievements newly earned since the last evaluation. */
export function evaluateAchievements(data: LearnerData): AchievementDefinition[] {
  const unlocked = new Set(data.achievements.map((a) => a.id));
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && a.isEarned(data));
}
