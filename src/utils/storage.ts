import { Student, Teacher, SecretMission } from '../types';

const DB_NAME = 'we_school_system_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

/**
 * IndexedDB helper for resilient background backup
 */
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbSet(key: string, value: any): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB set failed:', err);
  }
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export const saveToIndexedDB = idbSet;
export const loadFromIndexedDB = idbGet;

/**
 * Safe localStorage setter with fallback
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    // Also backup to IndexedDB in background
    idbSet(key, value);
    return true;
  } catch (err) {
    console.warn(`localStorage set failed for ${key}, relying on IndexedDB:`, err);
    idbSet(key, value);
    return false;
  }
}

/**
 * Safe localStorage getter
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn(`localStorage get failed for ${key}:`, err);
  }
  return defaultValue;
}

/**
 * Migration helper to ensure any legacy references to "بهاء وجيه"
 * are dynamically and seamlessly updated to "م. أبانوب وجيه (مدير المنظومة)".
 */
export function migrateLegacyNames(
  teachers: Teacher[],
  missions: SecretMission[],
  students: Student[]
): {
  teachers: Teacher[];
  missions: SecretMission[];
  students: Student[];
  migrated: boolean;
} {
  let migrated = false;
  const OLD_NAME_PART = 'بهاء';
  const TARGET_NAME = 'م. أبانوب وجيه (مدير المنظومة)';

  // 1. Migrate Teachers
  const updatedTeachers = teachers.map((t) => {
    if (t.id === 't-admin' || (t.role === 'admin' && t.name.includes(OLD_NAME_PART))) {
      migrated = true;
      return {
        ...t,
        name: TARGET_NAME,
        username: t.username || 'admin',
        title: 'مهندس'
      };
    }
    return t;
  });

  // 2. Migrate Missions
  const updatedMissions = missions.map((m) => {
    if (m.createdBy && m.createdBy.includes(OLD_NAME_PART)) {
      migrated = true;
      return {
        ...m,
        createdBy: TARGET_NAME
      };
    }
    return m;
  });

  // 3. Migrate Student Logs
  const updatedStudents = students.map((s) => {
    let studentLogsModified = false;
    const updatedLogs = s.logs.map((log) => {
      if (log.teacherName && log.teacherName.includes(OLD_NAME_PART)) {
        migrated = true;
        studentLogsModified = true;
        return {
          ...log,
          teacherName: TARGET_NAME
        };
      }
      return log;
    });

    if (studentLogsModified) {
      return {
        ...s,
        logs: updatedLogs
      };
    }
    return s;
  });

  return {
    teachers: updatedTeachers,
    missions: updatedMissions,
    students: updatedStudents,
    migrated
  };
}
