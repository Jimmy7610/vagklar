import { APP_VERSION, SCHEMA_VERSION } from '@/domain/constants';
import type {
  AchievementUnlock,
  AnswerRecord,
  ExamAttempt,
  LearnerData,
  LessonProgress,
  MasteryState,
  QuestionState,
  ReadinessSnapshot,
  SessionSummary,
} from '@/domain/learner/types';
import { migrateLearnerPayload } from './schema';
import {
  isRecord,
  readAchievement,
  readAnswer,
  readExamAttempt,
  readLessonProgress,
  readMasteryState,
  readPracticeSession,
  readPreferences,
  readProfile,
  readQuestionState,
  readReadinessSnapshot,
  readSessionSummary,
} from './sanitize';

export const BACKUP_FORMAT = 'vagklar-backup';
export const BACKUP_FORMAT_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  formatVersion: number;
  schemaVersion: number;
  appVersion: string;
  exportedAt: string;
  data: LearnerData;
}

export function createBackup(data: LearnerData, now: number): BackupFile {
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date(now).toISOString(),
    data,
  };
}

export function backupFilename(now: number): string {
  const date = new Date(now);
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
  return `vagklar-backup-${stamp}.json`;
}

export interface ImportSummary {
  answers: number;
  questionsTracked: number;
  subcategoriesWithMastery: number;
  sessions: number;
  exams: number;
  lessons: number;
  achievements: number;
  exportedAt: string | null;
  appVersion: string | null;
  /** Records that were dropped because they did not validate. */
  skipped: number;
  /** Set when the payload came from an older schema and was migrated. */
  migratedFrom: number | null;
}

export type ImportResult =
  | { ok: true; data: LearnerData; summary: ImportSummary }
  | { ok: false; error: string };

/**
 * Parse and validate a backup file.
 *
 * Imported JSON is untrusted. Every record goes through the same defensive
 * readers used for persisted data, unknown fields are discarded, and anything
 * that does not validate is counted and skipped rather than trusted. The
 * caller shows the summary before replacing anything.
 */
export function parseBackup(json: string, now: number): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Filen är inte giltig JSON.' };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'Filen har inte rätt format.' };
  }

  if (parsed.format !== BACKUP_FORMAT) {
    return { ok: false, error: 'Det här ser inte ut som en säkerhetskopia från Vägklar.' };
  }

  const formatVersion = typeof parsed.formatVersion === 'number' ? parsed.formatVersion : 0;
  if (formatVersion > BACKUP_FORMAT_VERSION) {
    return {
      ok: false,
      error: 'Filen kommer från en nyare version av Vägklar och kan inte läsas in.',
    };
  }

  if (!isRecord(parsed.data)) {
    return { ok: false, error: 'Filen saknar innehåll att importera.' };
  }

  const storedSchemaVersion =
    typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : SCHEMA_VERSION;

  let payload: Record<string, unknown>;
  let migratedFrom: number | null;
  try {
    const migrated = migrateLearnerPayload(parsed.data, storedSchemaVersion);
    payload = migrated.payload;
    migratedFrom = migrated.migratedFrom;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Kunde inte läsa filen.' };
  }

  let skipped = 0;

  const answers: AnswerRecord[] = [];
  for (const raw of Array.isArray(payload.answers) ? payload.answers : []) {
    const record = readAnswer(raw);
    if (record) answers.push(record);
    else skipped += 1;
  }
  answers.sort((a, b) => a.answeredAt - b.answeredAt);

  const questionStates: Record<string, QuestionState> = {};
  const rawQuestionStates = isRecord(payload.questionStates)
    ? Object.values(payload.questionStates)
    : [];
  for (const raw of rawQuestionStates) {
    const state = readQuestionState(raw);
    if (state) questionStates[state.questionId] = state;
    else skipped += 1;
  }

  const mastery: Record<string, MasteryState> = {};
  const rawMastery = isRecord(payload.mastery) ? Object.values(payload.mastery) : [];
  for (const raw of rawMastery) {
    const state = readMasteryState(raw);
    if (state) mastery[state.subcategoryId] = state;
    else skipped += 1;
  }

  const sessions: SessionSummary[] = [];
  for (const raw of Array.isArray(payload.sessions) ? payload.sessions : []) {
    const summary = readSessionSummary(raw);
    if (summary) sessions.push(summary);
    else skipped += 1;
  }

  const exams: ExamAttempt[] = [];
  for (const raw of Array.isArray(payload.exams) ? payload.exams : []) {
    const attempt = readExamAttempt(raw);
    if (attempt) exams.push(attempt);
    else skipped += 1;
  }

  const lessons: Record<string, LessonProgress> = {};
  const rawLessons = isRecord(payload.lessons) ? Object.values(payload.lessons) : [];
  for (const raw of rawLessons) {
    const progress = readLessonProgress(raw);
    if (progress) lessons[progress.lessonId] = progress;
    else skipped += 1;
  }

  const achievements: AchievementUnlock[] = [];
  for (const raw of Array.isArray(payload.achievements) ? payload.achievements : []) {
    const unlock = readAchievement(raw);
    if (unlock) achievements.push(unlock);
    else skipped += 1;
  }

  const readinessHistory: ReadinessSnapshot[] = [];
  for (const raw of Array.isArray(payload.readinessHistory) ? payload.readinessHistory : []) {
    const snapshot = readReadinessSnapshot(raw);
    if (snapshot) readinessHistory.push(snapshot);
    else skipped += 1;
  }

  const activeExamId = typeof payload.activeExamId === 'string' ? payload.activeExamId : null;

  const data: LearnerData = {
    profile: readProfile(payload.profile, now),
    preferences: readPreferences(payload.preferences),
    answers,
    questionStates,
    mastery,
    sessions,
    activeSession: readPracticeSession(payload.activeSession),
    activeExamId: exams.some((e) => e.id === activeExamId) ? activeExamId : null,
    exams,
    lessons,
    achievements,
    readinessHistory,
  };

  if (
    answers.length === 0 &&
    Object.keys(mastery).length === 0 &&
    exams.length === 0 &&
    sessions.length === 0
  ) {
    return { ok: false, error: 'Filen innehöll ingen utveckling som gick att läsa in.' };
  }

  return {
    ok: true,
    data,
    summary: {
      answers: answers.length,
      questionsTracked: Object.keys(questionStates).length,
      subcategoriesWithMastery: Object.keys(mastery).length,
      sessions: sessions.length,
      exams: exams.length,
      lessons: Object.keys(lessons).length,
      achievements: achievements.length,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : null,
      appVersion: typeof parsed.appVersion === 'string' ? parsed.appVersion : null,
      skipped,
      migratedFrom,
    },
  };
}

/** Serialise a backup for download. */
export function serialiseBackup(backup: BackupFile): string {
  return JSON.stringify(backup, null, 2);
}
