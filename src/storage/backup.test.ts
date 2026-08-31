import { describe, expect, it } from 'vitest';
import { APP_VERSION, SCHEMA_VERSION } from '@/domain/constants';
import { createEmptyLearnerData } from './defaults';
import { backupFilename, createBackup, parseBackup, serialiseBackup } from './backup';
import { applyAnswer } from '@/domain/learner/applyAnswer';
import { getQuestion } from '@/domain/content/bank';
import type { LearnerData } from '@/domain/learner/types';

const NOW = new Date(2025, 4, 12, 10).getTime();

function dataWithProgress(): LearnerData {
  let data = createEmptyLearnerData(NOW - 1000);
  for (const id of ['kor-001', 'kor-002', 'has-001']) {
    const question = getQuestion(id)!;
    data = applyAnswer(data, {
      question,
      selectedAnswerId: question.correctAnswerId,
      confidence: 'known',
      responseMs: 9000,
      mode: 'training',
      at: NOW,
      answerId: `answer-${id}`,
      useResponseTimeSignal: true,
    }).data;
  }
  return data;
}

describe('createBackup', () => {
  it('stamps the format, schema and app version', () => {
    const backup = createBackup(dataWithProgress(), NOW);
    expect(backup.format).toBe('vagklar-backup');
    expect(backup.schemaVersion).toBe(SCHEMA_VERSION);
    expect(backup.appVersion).toBe(APP_VERSION);
    expect(backup.exportedAt).toBe(new Date(NOW).toISOString());
  });

  it('produces a dated filename', () => {
    expect(backupFilename(NOW)).toBe('vagklar-backup-2025-05-12.json');
  });
});

describe('parseBackup', () => {
  it('round-trips a real backup', () => {
    const original = dataWithProgress();
    const json = serialiseBackup(createBackup(original, NOW));
    const result = parseBackup(json, NOW);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.answers).toHaveLength(original.answers.length);
    expect(result.data.profile.totals.answered).toBe(original.profile.totals.answered);
    expect(Object.keys(result.data.mastery)).toHaveLength(Object.keys(original.mastery).length);
    expect(result.summary.answers).toBe(original.answers.length);
    expect(result.summary.skipped).toBe(0);
  });

  it('rejects text that is not JSON', () => {
    const result = parseBackup('not json at all', NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('JSON');
  });

  it('rejects JSON that is not a Vägklar backup', () => {
    const result = parseBackup(JSON.stringify({ hello: 'world' }), NOW);
    expect(result.ok).toBe(false);
  });

  it('rejects a backup from a newer format', () => {
    const backup = createBackup(dataWithProgress(), NOW);
    const tampered = { ...backup, formatVersion: 99 };
    const result = parseBackup(JSON.stringify(tampered), NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain('nyare');
  });

  it('rejects a backup from a newer data schema', () => {
    const backup = createBackup(dataWithProgress(), NOW);
    const tampered = { ...backup, schemaVersion: SCHEMA_VERSION + 5 };
    const result = parseBackup(JSON.stringify(tampered), NOW);
    expect(result.ok).toBe(false);
  });

  it('rejects a backup that contains nothing usable', () => {
    const backup = createBackup(createEmptyLearnerData(NOW), NOW);
    const result = parseBackup(JSON.stringify(backup), NOW);
    expect(result.ok).toBe(false);
  });

  it('never trusts imported values blindly', () => {
    const backup = createBackup(dataWithProgress(), NOW);
    const hostile = JSON.parse(JSON.stringify(backup));

    hostile.data.profile.totals.answered = -50_000;
    hostile.data.profile.streak.current = Number.NaN;
    hostile.data.mastery['kor-001'] = { subcategoryId: 'hogerregeln', score: 9999, observations: -3 };
    hostile.data.answers.push({ id: 'x', questionId: 'does-not-exist', correct: true });
    hostile.data.answers.push('a string where an object should be');
    hostile.data.preferences.theme = '<script>alert(1)</script>';
    hostile.data.preferences.textScale = 99;

    const result = parseBackup(JSON.stringify(hostile), NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.data.profile.totals.answered).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.data.profile.streak.current)).toBe(true);
    expect(result.data.mastery['hogerregeln']?.score).toBeLessThanOrEqual(1);
    expect(result.data.mastery['hogerregeln']?.observations).toBeGreaterThanOrEqual(0);
    expect(result.data.answers.every((a) => a.questionId !== 'does-not-exist')).toBe(true);
    expect(result.data.preferences.theme).toBe('system');
    expect(result.data.preferences.textScale).toBe(1);
    expect(result.summary.skipped).toBeGreaterThan(0);
  });

  it('drops an active exam reference that points nowhere', () => {
    const backup = createBackup(dataWithProgress(), NOW);
    const tampered = JSON.parse(JSON.stringify(backup));
    tampered.data.activeExamId = 'ghost-exam';
    const result = parseBackup(JSON.stringify(tampered), NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.activeExamId).toBeNull();
  });

  it('reports a summary the UI can show before replacing anything', () => {
    const json = serialiseBackup(createBackup(dataWithProgress(), NOW));
    const result = parseBackup(json, NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.summary.exportedAt).toBe(new Date(NOW).toISOString());
    expect(result.summary.appVersion).toBe(APP_VERSION);
    expect(result.summary.migratedFrom).toBeNull();
  });
});
