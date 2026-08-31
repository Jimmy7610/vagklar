/**
 * A minimal promise wrapper around IndexedDB.
 *
 * We deliberately do not pull in a dependency here. The surface we need is
 * small (open with migrations, get/put/delete/getAll on a handful of stores),
 * and owning it means we control the failure behaviour — which matters,
 * because a browser in private mode or with storage disabled must degrade
 * gracefully rather than crash the app.
 */

export type StoreName =
  | 'meta'
  | 'answers'
  | 'questionStates'
  | 'mastery'
  | 'sessions'
  | 'exams'
  | 'lessons'
  | 'achievements'
  | 'readiness';

export interface StoreDefinition {
  name: StoreName;
  keyPath: string;
  indexes?: Array<{ name: string; keyPath: string; unique?: boolean }>;
}

export class StorageUnavailableError extends Error {
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'StorageUnavailableError';
    this.cause = cause;
  }
}

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export interface OpenOptions {
  name: string;
  version: number;
  stores: StoreDefinition[];
  /**
   * Called inside the versionchange transaction after stores exist, so data
   * migrations can rewrite records.
   */
  migrate?: (db: IDBDatabase, transaction: IDBTransaction, fromVersion: number) => void;
}

export async function openDatabase(options: OpenOptions): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    throw new StorageUnavailableError('IndexedDB is not available in this browser');
  }

  return new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(options.name, options.version);
    } catch (error) {
      reject(new StorageUnavailableError('Could not open IndexedDB', error));
      return;
    }

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = request.transaction;
      if (!transaction) return;

      for (const store of options.stores) {
        if (!db.objectStoreNames.contains(store.name)) {
          const created = db.createObjectStore(store.name, { keyPath: store.keyPath });
          for (const index of store.indexes ?? []) {
            created.createIndex(index.name, index.keyPath, { unique: index.unique ?? false });
          }
        } else {
          const existing = transaction.objectStore(store.name);
          for (const index of store.indexes ?? []) {
            if (!existing.indexNames.contains(index.name)) {
              existing.createIndex(index.name, index.keyPath, { unique: index.unique ?? false });
            }
          }
        }
      }

      options.migrate?.(db, transaction, event.oldVersion);
    };

    request.onsuccess = () => {
      const db = request.result;
      // If another tab upgrades the schema, close so it is not blocked.
      db.onversionchange = () => db.close();
      resolve(db);
    };

    request.onerror = () =>
      reject(new StorageUnavailableError('Could not open IndexedDB', request.error));

    request.onblocked = () =>
      reject(new StorageUnavailableError('IndexedDB upgrade blocked by another tab'));
  });
}

export function getAll<T>(db: IDBDatabase, store: StoreName): Promise<T[]> {
  const transaction = db.transaction(store, 'readonly');
  return promisify(transaction.objectStore(store).getAll() as IDBRequest<T[]>);
}

export function get<T>(db: IDBDatabase, store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const transaction = db.transaction(store, 'readonly');
  return promisify(transaction.objectStore(store).get(key) as IDBRequest<T | undefined>);
}

export function put(db: IDBDatabase, store: StoreName, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    transaction.objectStore(store).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Write failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Write aborted'));
  });
}

export function putMany(db: IDBDatabase, store: StoreName, values: unknown[]): Promise<void> {
  if (values.length === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    const objectStore = transaction.objectStore(store);
    for (const value of values) objectStore.put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Bulk write failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Bulk write aborted'));
  });
}

export function remove(db: IDBDatabase, store: StoreName, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    transaction.objectStore(store).delete(key);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Delete failed'));
  });
}

export function clearStores(db: IDBDatabase, stores: StoreName[]): Promise<void> {
  if (stores.length === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(stores, 'readwrite');
    for (const store of stores) transaction.objectStore(store).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Clear failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Clear aborted'));
  });
}

/** Delete the whole database. Used by "Återställ all data". */
export function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      resolve();
      return;
    }
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not delete database'));
    // A blocked delete still resolves once the other connection closes; do not
    // hang the UI waiting for it.
    request.onblocked = () => resolve();
  });
}
