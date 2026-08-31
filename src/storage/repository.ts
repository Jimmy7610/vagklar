import { APP_VERSION, SCHEMA_VERSION } from '@/domain/constants';
import type {
  AchievementUnlock,
  AnswerRecord,
  ExamAttempt,
  LearnerData,
  LearnerProfile,
  LessonProgress,
  MasteryState,
  Preferences,
  PracticeSession,
  QuestionState,
  ReadinessSnapshot,
  SessionSummary,
} from '@/domain/learner/types';
import {
  StorageUnavailableError,
  clearStores,
  deleteDatabase,
  getAll,
  openDatabase,
  put,
  putMany,
  remove,
} from './idb';
import { DATABASE_NAME, DATABASE_VERSION, META_KEYS, STORES } from './schema';
import { createEmptyLearnerData } from './defaults';
import {
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

export type StorageMode = 'indexeddb' | 'memory';

export interface LoadResult {
  data: LearnerData;
  mode: StorageMode;
  /** Human-readable notes about anything we had to drop or repair. */
  warnings: string[];
  /** True when this is a brand-new profile. */
  isNew: boolean;
}

interface MetaRow {
  key: string;
  value: unknown;
}

/**
 * The learner repository.
 *
 * The full learner dataset is small enough to hold in memory, so the app reads
 * it once at boot and then writes through granularly. That keeps every screen
 * instant and keeps the reactive state layer free of async reads.
 *
 * If IndexedDB is unavailable (private mode, disabled storage, an old browser)
 * the repository silently falls back to memory-only mode. The app still works
 * for the session; the UI surfaces that progress will not be saved.
 */
export class LearnerRepository {
  private db: IDBDatabase | null = null;
  private mode: StorageMode = 'memory';
  /**
   * Incremented by `resetAll` so a bulk write that straddles a reset aborts
   * halfway rather than repopulating the fresh database.
   */
  private generation = 0;
  /**
   * When the last reset happened.
   *
   * A write is not stale because of *when it was called* — a `pagehide`
   * handler can fire after the reset resolves — but because of *what it
   * carries*. Any record whose own timestamp predates the reset belongs to the
   * deleted profile and is dropped. That is what stops an in-flight
   * persistence callback from resurrecting erased progress.
   */
  private resetAt = 0;

  /** True when a record belongs to a profile that has since been erased. */
  private isStale(timestamp: number | null | undefined): boolean {
    if (this.resetAt === 0) return false;
    if (timestamp === null || timestamp === undefined) return false;
    return timestamp < this.resetAt;
  }

  getMode(): StorageMode {
    return this.mode;
  }

  async load(now: number): Promise<LoadResult> {
    const warnings: string[] = [];

    try {
      this.db = await openDatabase({
        name: DATABASE_NAME,
        version: DATABASE_VERSION,
        stores: STORES,
      });
      this.mode = 'indexeddb';
    } catch (error) {
      this.db = null;
      this.mode = 'memory';
      const message =
        error instanceof StorageUnavailableError
          ? 'Din webbläsare tillåter inte lagring. Utvecklingen sparas bara under den här sessionen.'
          : 'Kunde inte öppna det lokala lagret. Utvecklingen sparas bara under den här sessionen.';
      warnings.push(message);
      return { data: createEmptyLearnerData(now), mode: 'memory', warnings, isNew: true };
    }

    try {
      return await this.readAll(now, warnings);
    } catch {
      warnings.push('Sparad data kunde inte läsas och har hoppats över.');
      return { data: createEmptyLearnerData(now), mode: this.mode, warnings, isNew: true };
    }
  }

  private async readAll(now: number, warnings: string[]): Promise<LoadResult> {
    const db = this.db;
    if (!db) throw new Error('Database not open');

    const [
      metaRows,
      rawAnswers,
      rawQuestionStates,
      rawMastery,
      rawSessions,
      rawExams,
      rawLessons,
      rawAchievements,
      rawReadiness,
    ] = await Promise.all([
      getAll<MetaRow>(db, 'meta'),
      getAll<unknown>(db, 'answers'),
      getAll<unknown>(db, 'questionStates'),
      getAll<unknown>(db, 'mastery'),
      getAll<unknown>(db, 'sessions'),
      getAll<unknown>(db, 'exams'),
      getAll<unknown>(db, 'lessons'),
      getAll<unknown>(db, 'achievements'),
      getAll<unknown>(db, 'readiness'),
    ]);

    const meta = new Map(metaRows.map((row) => [row.key, row.value]));
    const isNew = !meta.has(META_KEYS.profile);

    const storedVersion =
      typeof meta.get(META_KEYS.schemaVersion) === 'number'
        ? (meta.get(META_KEYS.schemaVersion) as number)
        : SCHEMA_VERSION;

    if (storedVersion > SCHEMA_VERSION) {
      warnings.push(
        'Sparad data kommer från en nyare version av Vägklar och kunde inte läsas in säkert.',
      );
      return { data: createEmptyLearnerData(now), mode: this.mode, warnings, isNew: true };
    }

    const dropped = { answers: 0, questionStates: 0, mastery: 0, exams: 0 };

    const answers: AnswerRecord[] = [];
    for (const raw of rawAnswers) {
      const record = readAnswer(raw);
      if (record) answers.push(record);
      else dropped.answers += 1;
    }
    answers.sort((a, b) => a.answeredAt - b.answeredAt);

    const questionStates: Record<string, QuestionState> = {};
    for (const raw of rawQuestionStates) {
      const state = readQuestionState(raw);
      if (state) questionStates[state.questionId] = state;
      else dropped.questionStates += 1;
    }

    const mastery: Record<string, MasteryState> = {};
    for (const raw of rawMastery) {
      const state = readMasteryState(raw);
      if (state) mastery[state.subcategoryId] = state;
      else dropped.mastery += 1;
    }

    const sessions: SessionSummary[] = [];
    for (const raw of rawSessions) {
      const summary = readSessionSummary(raw);
      if (summary) sessions.push(summary);
    }
    sessions.sort((a, b) => a.startedAt - b.startedAt);

    const exams: ExamAttempt[] = [];
    for (const raw of rawExams) {
      const attempt = readExamAttempt(raw);
      if (attempt) exams.push(attempt);
      else dropped.exams += 1;
    }
    exams.sort((a, b) => a.startedAt - b.startedAt);

    const lessons: Record<string, LessonProgress> = {};
    for (const raw of rawLessons) {
      const progress = readLessonProgress(raw);
      if (progress) lessons[progress.lessonId] = progress;
    }

    const achievements: AchievementUnlock[] = [];
    for (const raw of rawAchievements) {
      const unlock = readAchievement(raw);
      if (unlock) achievements.push(unlock);
    }

    const readinessHistory: ReadinessSnapshot[] = [];
    for (const raw of rawReadiness) {
      const snapshot = readReadinessSnapshot(raw);
      if (snapshot) readinessHistory.push(snapshot);
    }
    readinessHistory.sort((a, b) => a.date.localeCompare(b.date));

    const activeExamId =
      typeof meta.get(META_KEYS.activeExamId) === 'string'
        ? (meta.get(META_KEYS.activeExamId) as string)
        : null;

    const droppedTotal =
      dropped.answers + dropped.questionStates + dropped.mastery + dropped.exams;
    if (droppedTotal > 0) {
      warnings.push(
        `${droppedTotal} sparade poster kunde inte läsas och har hoppats över. Resten av din utveckling är intakt.`,
      );
    }

    const data: LearnerData = {
      profile: readProfile(meta.get(META_KEYS.profile), now),
      preferences: readPreferences(meta.get(META_KEYS.preferences)),
      answers,
      questionStates,
      mastery,
      sessions,
      activeSession: readPracticeSession(meta.get(META_KEYS.activeSession)),
      activeExamId: exams.some((e) => e.id === activeExamId) ? activeExamId : null,
      exams,
      lessons,
      achievements,
      readinessHistory,
    };

    if (isNew) {
      await this.writeMeta(META_KEYS.schemaVersion, SCHEMA_VERSION);
      await this.writeMeta(META_KEYS.appVersion, APP_VERSION);
      await this.saveProfile(data.profile);
      await this.savePreferences(data.preferences);
    } else {
      await this.writeMeta(META_KEYS.appVersion, APP_VERSION);
    }

    return { data, mode: this.mode, warnings, isNew };
  }

  /* ---- Writes -------------------------------------------------------- */

  private async guarded(generation: number, work: (db: IDBDatabase) => Promise<void>): Promise<void> {
    const db = this.db;
    if (!db || generation !== this.generation) return;
    try {
      await work(db);
    } catch (error) {
      // A failed write must never break the running session. The in-memory
      // state stays correct; the next write may well succeed.
      if (import.meta.env?.DEV) console.warn('Vägklar: persistence write failed', error);
    }
  }

  private writeMeta(key: string, value: unknown): Promise<void> {
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'meta', { key, value }));
  }

  saveProfile(profile: LearnerProfile): Promise<void> {
    if (this.isStale(profile.createdAt)) return Promise.resolve();
    return this.writeMeta(META_KEYS.profile, profile);
  }

  savePreferences(preferences: Preferences): Promise<void> {
    // Preferences are not learning progress; keeping them across a reset would
    // be reasonable, but the reset copy explicitly promises a clean slate.
    return this.writeMeta(META_KEYS.preferences, preferences);
  }

  saveActiveSession(session: PracticeSession | null): Promise<void> {
    if (session && this.isStale(session.startedAt)) return Promise.resolve();
    return this.writeMeta(META_KEYS.activeSession, session);
  }

  saveActiveExamId(id: string | null): Promise<void> {
    return this.writeMeta(META_KEYS.activeExamId, id);
  }

  appendAnswer(answer: AnswerRecord): Promise<void> {
    if (this.isStale(answer.answeredAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'answers', answer));
  }

  saveQuestionState(state: QuestionState): Promise<void> {
    if (this.isStale(state.lastAnsweredAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'questionStates', state));
  }

  saveMasteryState(state: MasteryState): Promise<void> {
    if (this.isStale(state.lastPracticedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'mastery', state));
  }

  saveSessionSummary(summary: SessionSummary): Promise<void> {
    if (this.isStale(summary.startedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'sessions', summary));
  }

  saveExam(attempt: ExamAttempt): Promise<void> {
    if (this.isStale(attempt.startedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'exams', attempt));
  }

  saveLessonProgress(progress: LessonProgress): Promise<void> {
    if (this.isStale(progress.startedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'lessons', progress));
  }

  saveAchievement(unlock: AchievementUnlock): Promise<void> {
    if (this.isStale(unlock.unlockedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'achievements', unlock));
  }

  saveReadinessSnapshot(snapshot: ReadinessSnapshot): Promise<void> {
    if (this.isStale(snapshot.recordedAt)) return Promise.resolve();
    const generation = this.generation;
    return this.guarded(generation, (db) => put(db, 'readiness', snapshot));
  }

  deleteExam(id: string): Promise<void> {
    const generation = this.generation;
    return this.guarded(generation, (db) => remove(db, 'exams', id));
  }

  /** Bulk write, used by import. */
  async replaceAll(data: LearnerData): Promise<void> {
    const db = this.db;
    if (!db) return;
    // An import is a deliberate full replacement, and its records legitimately
    // predate any reset in this session — so the staleness guard is lifted.
    this.resetAt = 0;
    const generation = this.generation;

    await clearStores(db, [
      'answers',
      'questionStates',
      'mastery',
      'sessions',
      'exams',
      'lessons',
      'achievements',
      'readiness',
    ]);
    if (generation !== this.generation) return;

    await Promise.all([
      putMany(db, 'answers', data.answers),
      putMany(db, 'questionStates', Object.values(data.questionStates)),
      putMany(db, 'mastery', Object.values(data.mastery)),
      putMany(db, 'sessions', data.sessions),
      putMany(db, 'exams', data.exams),
      putMany(db, 'lessons', Object.values(data.lessons)),
      putMany(db, 'achievements', data.achievements),
      putMany(db, 'readiness', data.readinessHistory),
    ]);

    await this.writeMeta(META_KEYS.schemaVersion, SCHEMA_VERSION);
    await this.saveProfile(data.profile);
    await this.savePreferences(data.preferences);
    await this.saveActiveSession(data.activeSession);
    await this.saveActiveExamId(data.activeExamId);
  }

  /**
   * Delete everything and start from a clean database.
   *
   * The generation bump is what makes this safe: any write that was queued
   * before the reset — including one scheduled from a `pagehide` handler —
   * becomes a no-op instead of writing a stale record back into the fresh
   * database.
   */
  async resetAll(now: number): Promise<LearnerData> {
    this.generation += 1;
    this.resetAt = now;

    if (this.db) {
      this.db.close();
      this.db = null;
    }

    try {
      await deleteDatabase(DATABASE_NAME);
    } catch {
      // If deletion is blocked we still continue: the reopen below plus the
      // explicit clear leaves the database empty either way.
    }

    const fresh = createEmptyLearnerData(now);

    try {
      this.db = await openDatabase({
        name: DATABASE_NAME,
        version: DATABASE_VERSION,
        stores: STORES,
      });
      this.mode = 'indexeddb';
      await clearStores(this.db, [
        'meta',
        'answers',
        'questionStates',
        'mastery',
        'sessions',
        'exams',
        'lessons',
        'achievements',
        'readiness',
      ]);
      await this.writeMeta(META_KEYS.schemaVersion, SCHEMA_VERSION);
      await this.writeMeta(META_KEYS.appVersion, APP_VERSION);
      await this.saveProfile(fresh.profile);
      await this.savePreferences(fresh.preferences);
    } catch {
      this.db = null;
      this.mode = 'memory';
    }

    return fresh;
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }
}

export const learnerRepository = new LearnerRepository();
