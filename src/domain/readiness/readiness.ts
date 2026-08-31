import { EXAM, READINESS } from '@/domain/constants';
import { COVERED_SUBCATEGORY_IDS, subcategoryWeight } from '@/domain/content/bank';
import { CATEGORIES } from '@/content/taxonomy';
import { categoryMastery, clamp01, effectiveMastery, isReliable } from '@/domain/mastery/mastery';
import { overdueRatio } from '@/domain/repetition/repetition';
import type {
  AnswerRecord,
  ExamAttempt,
  LearnerData,
  MasteryState,
  QuestionState,
} from '@/domain/learner/types';

/**
 * Readiness ("Provberedskap").
 *
 * A weighted blend of seven components minus two penalties. It is *not*
 * correct/total: a learner who has answered fifty easy questions in one
 * category correctly is not ready, and the model says so.
 *
 * Components that cannot be computed yet (no exam attempts, nothing scheduled
 * for review) are dropped and the remaining weights are renormalised, so the
 * score never silently punishes a learner for something they have not had the
 * chance to do.
 *
 * The result is Vägklar's own estimate of preparedness. It is not a
 * probability of passing the official test, and the UI must never present it
 * as one. See docs/KNOWLEDGE-ENGINE.md for the full derivation.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type ReadinessComponentKey =
  | 'mastery'
  | 'coverage'
  | 'recentAccuracy'
  | 'exam'
  | 'retention'
  | 'consistency'
  | 'calibration';

export interface ReadinessComponent {
  key: ReadinessComponentKey;
  label: string;
  /** 0–1, or null when there is not enough data yet. */
  value: number | null;
  weight: number;
  /** Short explanation shown in the readiness breakdown. */
  description: string;
}

export interface ReadinessPenalty {
  key: 'weakCategories' | 'misconceptions';
  label: string;
  amount: number;
  detail: string;
}

export interface ReadinessResult {
  /** 0–100, or null when the learner has not answered anything yet. */
  score: number | null;
  /** True while the estimate rests on too little data to be trusted. */
  provisional: boolean;
  components: ReadinessComponent[];
  penalties: ReadinessPenalty[];
  answeredTotal: number;
  band: ReadinessBand;
}

export type ReadinessBand = 'none' | 'early' | 'building' | 'progressing' | 'close' | 'ready';

export interface ReadinessBandCopy {
  label: string;
  message: string;
}

export const READINESS_BAND_COPY: Record<ReadinessBand, ReadinessBandCopy> = {
  none: { label: 'Inte mätt än', message: 'Svara på några frågor så räknar vi ut din nivå.' },
  early: { label: 'Tidig fas', message: 'Du har börjat. Nu bygger vi grunden.' },
  building: { label: 'Bygger upp', message: 'Det lossnar. Fortsätt med dina svaga områden.' },
  progressing: { label: 'På god väg', message: 'Bra utveckling. Några områden återstår.' },
  close: { label: 'Nära provklar', message: 'Du är nära. Putsa på det som fortfarande vacklar.' },
  ready: { label: 'Provklar-nivå', message: 'Du ligger stabilt. Håll formen med repetition.' },
};

export function readinessBand(score: number | null): ReadinessBand {
  if (score === null) return 'none';
  if (score < 35) return 'early';
  if (score < 55) return 'building';
  if (score < 72) return 'progressing';
  if (score < 85) return 'close';
  return 'ready';
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

function masteryComponent(mastery: Readonly<Record<string, MasteryState>>): number {
  let weightSum = 0;
  let weighted = 0;
  for (const subcategoryId of COVERED_SUBCATEGORY_IDS) {
    const weight = subcategoryWeight(subcategoryId);
    weightSum += weight;
    weighted += weight * effectiveMastery(mastery[subcategoryId]);
  }
  return weightSum > 0 ? clamp01(weighted / weightSum) : 0;
}

function coverageComponent(mastery: Readonly<Record<string, MasteryState>>): number {
  if (COVERED_SUBCATEGORY_IDS.length === 0) return 0;
  const reliable = COVERED_SUBCATEGORY_IDS.filter((id) => isReliable(mastery[id])).length;
  return clamp01(reliable / COVERED_SUBCATEGORY_IDS.length);
}

function recentAccuracyComponent(answers: readonly AnswerRecord[]): number | null {
  const recent = answers.slice(-READINESS.recentAnswerWindow);
  if (recent.length < 10) return null;
  const correct = recent.filter((a) => a.correct).length;
  return clamp01(correct / recent.length);
}

function examComponent(exams: readonly ExamAttempt[]): number | null {
  const completed = exams
    .filter((e) => e.result !== null && (e.status === 'submitted' || e.status === 'expired'))
    .sort((a, b) => (a.submittedAt ?? a.updatedAt) - (b.submittedAt ?? b.updatedAt))
    .slice(-READINESS.examAttemptWindow);

  if (completed.length === 0) return null;

  // More recent attempts weigh more: 1, 2, 3, …
  let weightSum = 0;
  let weighted = 0;
  completed.forEach((attempt, index) => {
    const weight = index + 1;
    const score = attempt.result?.score ?? 0;
    const normalised = clamp01(
      (score - READINESS.examFloorScore) / (READINESS.examCeilingScore - READINESS.examFloorScore),
    );
    weightSum += weight;
    weighted += weight * normalised;
  });
  return clamp01(weighted / weightSum);
}

function retentionComponent(
  questionStates: Readonly<Record<string, QuestionState>>,
  now: number,
): number | null {
  const scheduled = Object.values(questionStates).filter((s) => s.dueAt !== null);
  if (scheduled.length < 5) return null;
  return clamp01(1 - overdueRatio(questionStates, now));
}

function consistencyComponent(
  answers: readonly AnswerRecord[],
  createdAt: number,
  now: number,
): number | null {
  if (now - createdAt < 3 * DAY_MS) return null;
  const since = now - READINESS.consistencyWindowDays * DAY_MS;
  const days = new Set<string>();
  for (const answer of answers) {
    if (answer.answeredAt >= since) days.add(isoDate(answer.answeredAt));
  }
  return clamp01(days.size / READINESS.consistencyTargetActiveDays);
}

/** Expected accuracy for each stated confidence level. */
const CALIBRATION_TARGET = { known: 0.95, uncertain: 0.7, guessed: 0.4 } as const;

function calibrationComponent(answers: readonly AnswerRecord[]): number | null {
  const tagged = answers.filter((a) => a.confidence !== null);
  if (tagged.length < 10) return null;

  const errors: number[] = [];
  for (const level of ['known', 'uncertain', 'guessed'] as const) {
    const bucket = tagged.filter((a) => a.confidence === level);
    if (bucket.length < 4) continue;
    const accuracy = bucket.filter((a) => a.correct).length / bucket.length;
    errors.push(Math.abs(accuracy - CALIBRATION_TARGET[level]));
  }
  if (errors.length === 0) return null;
  const meanError = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  // An average error of 0.5 or worse scores zero.
  return clamp01(1 - meanError / 0.5);
}

/* ------------------------------------------------------------------ */
/* Penalties                                                           */
/* ------------------------------------------------------------------ */

function weakCategoryPenalty(mastery: Readonly<Record<string, MasteryState>>): ReadinessPenalty {
  const weak: string[] = [];
  for (const category of CATEGORIES) {
    const summary = categoryMastery(mastery, category.id);
    if (summary.totalSubcategories === 0) continue;
    if (
      summary.observations >= READINESS.weakCategoryMinObservations &&
      summary.score < READINESS.weakCategoryMinScore
    ) {
      weak.push(category.name);
    }
  }
  const amount = Math.min(
    READINESS.weakCategoryPenaltyMax,
    weak.length * READINESS.weakCategoryPenaltyEach,
  );
  return {
    key: 'weakCategories',
    label: 'Svaga områden',
    amount,
    detail:
      weak.length === 0
        ? 'Inga områden ligger tydligt efter.'
        : `${weak.length} område${weak.length === 1 ? '' : 'n'} ligger under 50 %: ${weak.join(', ')}.`,
  };
}

function misconceptionPenalty(answers: readonly AnswerRecord[]): ReadinessPenalty {
  const recentMistakes = answers.filter((a) => !a.correct).slice(-40);
  const counts = new Map<string, number>();
  for (const mistake of recentMistakes) {
    if (!mistake.misconceptionId) continue;
    counts.set(mistake.misconceptionId, (counts.get(mistake.misconceptionId) ?? 0) + 1);
  }
  const repeated = Array.from(counts.values()).filter(
    (count) => count >= READINESS.misconceptionRepeatThreshold,
  ).length;
  const amount = Math.min(
    READINESS.misconceptionPenaltyMax,
    repeated * READINESS.misconceptionPenaltyEach,
  );
  return {
    key: 'misconceptions',
    label: 'Återkommande missuppfattningar',
    amount,
    detail:
      repeated === 0
        ? 'Inga tydligt återkommande feltankar.'
        : `${repeated} mönster återkommer i dina senaste misstag.`,
  };
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export interface ReadinessInput {
  mastery: Readonly<Record<string, MasteryState>>;
  questionStates: Readonly<Record<string, QuestionState>>;
  answers: readonly AnswerRecord[];
  exams: readonly ExamAttempt[];
  createdAt: number;
  now: number;
}

export function computeReadiness(input: ReadinessInput): ReadinessResult {
  const answeredTotal = input.answers.length;

  const components: ReadinessComponent[] = [
    {
      key: 'mastery',
      label: 'Kunskapstäckning',
      value: masteryComponent(input.mastery),
      weight: READINESS.weights.mastery,
      description: 'Hur väl du behärskar delområdena, viktat efter hur mycket data vi har.',
    },
    {
      key: 'coverage',
      label: 'Bredd',
      value: coverageComponent(input.mastery),
      weight: READINESS.weights.coverage,
      description: 'Hur stor del av teorin du faktiskt har tränat på.',
    },
    {
      key: 'recentAccuracy',
      label: 'Senaste resultaten',
      value: recentAccuracyComponent(input.answers),
      weight: READINESS.weights.recentAccuracy,
      description: `Andel rätt på dina senaste ${READINESS.recentAnswerWindow} svar.`,
    },
    {
      key: 'exam',
      label: 'Provresultat',
      value: examComponent(input.exams),
      weight: READINESS.weights.exam,
      description: 'Dina senaste provsimuleringar, med störst vikt på det senaste.',
    },
    {
      key: 'retention',
      label: 'Repetition',
      value: retentionComponent(input.questionStates, input.now),
      weight: READINESS.weights.retention,
      description: 'Hur mycket av det du lärt dig som ligger och väntar på repetition.',
    },
    {
      key: 'consistency',
      label: 'Regelbundenhet',
      value: consistencyComponent(input.answers, input.createdAt, input.now),
      weight: READINESS.weights.consistency,
      description: `Antal aktiva dagar de senaste ${READINESS.consistencyWindowDays} dagarna.`,
    },
    {
      key: 'calibration',
      label: 'Självkännedom',
      value: calibrationComponent(input.answers),
      weight: READINESS.weights.calibration,
      description: 'Hur väl din egen säkerhet stämmer med hur det faktiskt går.',
    },
  ];

  const penalties = [weakCategoryPenalty(input.mastery), misconceptionPenalty(input.answers)];

  if (answeredTotal === 0) {
    return {
      score: null,
      provisional: true,
      components,
      penalties,
      answeredTotal,
      band: 'none',
    };
  }

  const available = components.filter((c) => c.value !== null);
  const weightSum = available.reduce((sum, c) => sum + c.weight, 0);
  const weighted = available.reduce((sum, c) => sum + c.weight * (c.value ?? 0), 0);
  const base = weightSum > 0 ? weighted / weightSum : 0;

  const penaltyTotal = penalties.reduce((sum, p) => sum + p.amount, 0);
  let score = Math.round(clamp01(base - penaltyTotal) * 100);

  const provisional = answeredTotal < READINESS.provisionalAnswerThreshold;
  if (provisional) score = Math.min(score, READINESS.provisionalCap);

  return { score, provisional, components, penalties, answeredTotal, band: readinessBand(score) };
}

/** Convenience wrapper over the whole learner record. */
export function readinessFromLearner(data: LearnerData, now: number): ReadinessResult {
  return computeReadiness({
    mastery: data.mastery,
    questionStates: data.questionStates,
    answers: data.answers,
    exams: data.exams,
    createdAt: data.profile.createdAt,
    now,
  });
}

/** Score needed on the simulated exam, exposed for copy that references it. */
export const EXAM_PASS_COPY = `${EXAM.passThreshold} av ${EXAM.scoredQuestions} rätt krävs`;

export function isoDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
