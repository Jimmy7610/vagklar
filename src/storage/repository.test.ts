import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { LearnerRepository } from './repository';
import { DATABASE_NAME, DATABASE_VERSION, META_KEYS, STORES } from './schema';
import { openDatabase, put } from './idb';
import { createEmptyLearnerData } from './defaults';
import { applyAnswer } from '@/domain/learner/applyAnswer';
import { getQuestion } from '@/domain/content/bank';
import { SCHEMA_VERSION } from '@/domain/constants';
import type { LearnerData } from '@/domain/learner/types';

const NOW = new Date(2025, 4, 12, 10).getTime();

function withAnswers(count: number): LearnerData {
  let data = createEmptyLearnerData(NOW - 10_000);
  const ids = ['kor-001', 'kor-002', 'has-001', 'par-001', 'mor-001'];
  for (let i = 0; i < count; i += 1) {
    const question = getQuestion(ids[i % ids.length]!)!;
    data = applyAnswer(data, {
      question,
      selectedAnswerId: question.correctAnswerId,
      confidence: 'known',
      responseMs: 8000,
      mode: 'training',
      at: NOW + i,
      answerId: `answer-${i}`,
      useResponseTimeSignal: true,
    }).data;
  }
  return data;
}

/** Every test starts from a genuinely empty browser. */
beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

afterEach(() => {
  globalThis.indexedDB = new IDBFactory();
});

describe('LearnerRepository', () => {
  it('starts a brand-new learner with genuinely empty state', async () => {
    const repository = new LearnerRepository();
    const result = await repository.load(NOW);

    expect(result.mode).toBe('indexeddb');
    expect(result.isNew).toBe(true);
    expect(result.data.answers).toHaveLength(0);
    expect(result.data.profile.totals.answered).toBe(0);
    expect(result.data.readinessHistory).toHaveLength(0);
    repository.close();
  });

  it('persists progress across a reload', async () => {
    const first = new LearnerRepository();
    await first.load(NOW);

    const data = withAnswers(5);
    for (const answer of data.answers) await first.appendAnswer(answer);
    for (const state of Object.values(data.questionStates)) await first.saveQuestionState(state);
    for (const state of Object.values(data.mastery)) await first.saveMasteryState(state);
    await first.saveProfile(data.profile);
    first.close();

    // A fresh repository instance stands in for a page reload.
    const second = new LearnerRepository();
    const reloaded = await second.load(NOW + 1000);

    expect(reloaded.isNew).toBe(false);
    expect(reloaded.data.answers).toHaveLength(5);
    expect(reloaded.data.profile.totals.answered).toBe(5);
    expect(Object.keys(reloaded.data.mastery).length).toBeGreaterThan(0);
    second.close();
  });

  it('restores an unfinished practice session', async () => {
    const first = new LearnerRepository();
    await first.load(NOW);

    const session = {
      id: 'session-1',
      mode: 'training' as const,
      categoryId: null,
      label: 'Högerregeln',
      questionIds: ['kor-001', 'kor-002'],
      questions: [
        {
          questionId: 'kor-001',
          selectedAnswerId: 'a',
          confidence: null,
          correct: true,
          responseMs: 5000,
          answeredAt: NOW,
        },
        {
          questionId: 'kor-002',
          selectedAnswerId: null,
          confidence: null,
          correct: null,
          responseMs: null,
          answeredAt: null,
        },
      ],
      currentIndex: 1,
      startedAt: NOW,
      updatedAt: NOW,
      completedAt: null,
      masteryBefore: { hogerregeln: 0.4 },
    };
    await first.saveActiveSession(session);
    first.close();

    const second = new LearnerRepository();
    const reloaded = await second.load(NOW + 5000);
    expect(reloaded.data.activeSession?.id).toBe('session-1');
    expect(reloaded.data.activeSession?.currentIndex).toBe(1);
    second.close();
  });

  it('survives corrupt records by skipping them and warning', async () => {
    // Seed the database directly with a mix of valid and broken rows.
    const db = await openDatabase({
      name: DATABASE_NAME,
      version: DATABASE_VERSION,
      stores: STORES,
    });
    await put(db, 'meta', { key: META_KEYS.schemaVersion, value: SCHEMA_VERSION });
    await put(db, 'meta', { key: META_KEYS.profile, value: createEmptyLearnerData(NOW).profile });

    const good = withAnswers(2).answers;
    for (const answer of good) await put(db, 'answers', answer);

    await put(db, 'answers', { id: 'broken-1', questionId: 'no-such-question', correct: true });
    await put(db, 'answers', { id: 'broken-2' });
    await put(db, 'mastery', { subcategoryId: 'not-a-real-subcategory', score: 0.5 });
    await put(db, 'questionStates', { questionId: 'ghost', seenCount: 3 });
    db.close();

    const repository = new LearnerRepository();
    const result = await repository.load(NOW);

    expect(result.data.answers).toHaveLength(2);
    expect(result.data.mastery['not-a-real-subcategory']).toBeUndefined();
    expect(result.data.questionStates['ghost']).toBeUndefined();
    expect(result.warnings.length).toBeGreaterThan(0);
    repository.close();
  });

  it('refuses to load data written by a newer schema', async () => {
    const db = await openDatabase({
      name: DATABASE_NAME,
      version: DATABASE_VERSION,
      stores: STORES,
    });
    await put(db, 'meta', { key: META_KEYS.schemaVersion, value: SCHEMA_VERSION + 3 });
    await put(db, 'meta', { key: META_KEYS.profile, value: createEmptyLearnerData(NOW).profile });
    db.close();

    const repository = new LearnerRepository();
    const result = await repository.load(NOW);

    expect(result.data.answers).toHaveLength(0);
    expect(result.warnings.join(' ')).toContain('nyare');
    repository.close();
  });

  it('resets to a clean profile that survives a reload', async () => {
    const repository = new LearnerRepository();
    await repository.load(NOW);

    const data = withAnswers(6);
    for (const answer of data.answers) await repository.appendAnswer(answer);
    await repository.saveProfile(data.profile);

    const fresh = await repository.resetAll(NOW + 1000);
    expect(fresh.answers).toHaveLength(0);
    expect(fresh.profile.totals.answered).toBe(0);
    repository.close();

    const after = new LearnerRepository();
    const reloaded = await after.load(NOW + 2000);
    expect(reloaded.data.answers).toHaveLength(0);
    expect(reloaded.data.profile.totals.answered).toBe(0);
    after.close();
  });

  it('discards writes that were queued before a reset', async () => {
    const repository = new LearnerRepository();
    await repository.load(NOW);

    const data = withAnswers(3);
    const staleAnswer = data.answers[0]!;
    const staleProfile = data.profile;

    await repository.resetAll(NOW + 1000);

    // Simulates a persistence callback (e.g. from `pagehide`) that was already
    // in flight when the learner confirmed the reset.
    await repository.appendAnswer(staleAnswer);
    await repository.saveProfile(staleProfile);
    repository.close();

    const after = new LearnerRepository();
    const reloaded = await after.load(NOW + 2000);
    expect(reloaded.data.answers).toHaveLength(0);
    expect(reloaded.data.profile.totals.answered).toBe(0);
    after.close();
  });

  it('replaces everything on import without leaving old records behind', async () => {
    const repository = new LearnerRepository();
    await repository.load(NOW);

    const original = withAnswers(8);
    for (const answer of original.answers) await repository.appendAnswer(answer);
    await repository.saveProfile(original.profile);

    const imported = withAnswers(2);
    await repository.replaceAll(imported);
    repository.close();

    const after = new LearnerRepository();
    const reloaded = await after.load(NOW + 5000);
    expect(reloaded.data.answers).toHaveLength(2);
    after.close();
  });

  it('falls back to memory mode when IndexedDB is unavailable', async () => {
    const original = globalThis.indexedDB;
    // @ts-expect-error deliberately removing the API to simulate private mode
    delete globalThis.indexedDB;

    const repository = new LearnerRepository();
    const result = await repository.load(NOW);

    expect(result.mode).toBe('memory');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.data.answers).toHaveLength(0);

    globalThis.indexedDB = original;
  });

  it('never throws when a write fails in memory mode', async () => {
    const original = globalThis.indexedDB;
    // @ts-expect-error deliberately removing the API to simulate private mode
    delete globalThis.indexedDB;

    const repository = new LearnerRepository();
    const result = await repository.load(NOW);
    await expect(repository.appendAnswer(withAnswers(1).answers[0]!)).resolves.toBeUndefined();
    await expect(repository.saveProfile(result.data.profile)).resolves.toBeUndefined();

    globalThis.indexedDB = original;
  });
});

describe('reset then import', () => {
  it('accepts an import whose records predate the reset', async () => {
    const repository = new LearnerRepository();
    await repository.load(NOW);
    await repository.resetAll(NOW + 1000);

    const imported = withAnswers(4);
    await repository.replaceAll(imported);
    repository.close();

    const after = new LearnerRepository();
    const reloaded = await after.load(NOW + 5000);
    expect(reloaded.data.answers).toHaveLength(4);
    expect(reloaded.data.profile.totals.answered).toBe(4);
    after.close();
  });
});
