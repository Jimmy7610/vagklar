import { SCHEMA_VERSION } from '@/domain/constants';
import type { StoreDefinition } from './idb';

export const DATABASE_NAME = 'vagklar';

/**
 * The IndexedDB schema version.
 *
 * Bump this whenever stores or indexes change, and add a matching entry to
 * MIGRATIONS below. The learner-data shape version is tracked separately in
 * `meta.schemaVersion` so we can also migrate record *contents* without a
 * database upgrade.
 */
export const DATABASE_VERSION = 1;

export const STORES: StoreDefinition[] = [
  { name: 'meta', keyPath: 'key' },
  {
    name: 'answers',
    keyPath: 'id',
    indexes: [
      { name: 'byQuestion', keyPath: 'questionId' },
      { name: 'byTime', keyPath: 'answeredAt' },
      { name: 'bySubcategory', keyPath: 'subcategory' },
    ],
  },
  { name: 'questionStates', keyPath: 'questionId', indexes: [{ name: 'byDue', keyPath: 'dueAt' }] },
  { name: 'mastery', keyPath: 'subcategoryId' },
  { name: 'sessions', keyPath: 'id', indexes: [{ name: 'byTime', keyPath: 'startedAt' }] },
  { name: 'exams', keyPath: 'id', indexes: [{ name: 'byTime', keyPath: 'startedAt' }] },
  { name: 'lessons', keyPath: 'lessonId' },
  { name: 'achievements', keyPath: 'id' },
  { name: 'readiness', keyPath: 'date' },
];

export const META_KEYS = {
  schemaVersion: 'schemaVersion',
  appVersion: 'appVersion',
  profile: 'profile',
  preferences: 'preferences',
  activeSession: 'activeSession',
  activeExamId: 'activeExamId',
} as const;

/**
 * Content migrations, applied in order after load.
 *
 * Each migration takes the raw persisted payload of an older schema version
 * and returns a payload one version newer. They must be pure and total: given
 * anything at all, produce something the next migration can handle.
 */
export type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

export const MIGRATIONS: Record<number, Migration> = {
  // No migrations yet — version 1 is the initial schema. When the shape
  // changes, add e.g.:
  //   2: (data) => ({ ...data, preferences: { ...(data.preferences ?? {}), newField: false } }),
};

export function migrateLearnerPayload(
  payload: Record<string, unknown>,
  fromVersion: number,
): { payload: Record<string, unknown>; migratedFrom: number | null } {
  if (fromVersion === SCHEMA_VERSION) return { payload, migratedFrom: null };
  if (fromVersion > SCHEMA_VERSION) {
    // Data written by a newer build. We cannot safely interpret it.
    throw new Error(
      `Sparad data kommer från en nyare version (${fromVersion} > ${SCHEMA_VERSION}).`,
    );
  }

  let current = payload;
  for (let version = fromVersion + 1; version <= SCHEMA_VERSION; version += 1) {
    const migration = MIGRATIONS[version];
    if (migration) current = migration(current);
  }
  return { payload: current, migratedFrom: fromVersion };
}
