import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { Student, Teacher, SecretMission } from '../types';
import { INITIAL_TEACHERS, INITIAL_MISSIONS } from '../data/mockData';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigJson.projectId || "premium-spanner-l14dk",
  appId: firebaseConfigJson.appId || "1:428567393559:web:f853ec988cf03ef32eb352",
  apiKey: firebaseConfigJson.apiKey || "AIzaSyB0Z5MvHSy1mNa7fGa73MXAXWSgrTEqfxA",
  authDomain: firebaseConfigJson.authDomain || "premium-spanner-l14dk.firebaseapp.com",
  firestoreDatabaseId: firebaseConfigJson.firestoreDatabaseId || "ai-studio-we-b4939639-984b-4df3-badb-d73451d6cbfd",
  storageBucket: firebaseConfigJson.storageBucket || "premium-spanner-l14dk.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "428567393559"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore (supporting named database if present)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const STUDENTS_COLLECTION = 'students';
export const TEACHERS_COLLECTION = 'teachers';
export const MISSIONS_COLLECTION = 'missions';

/**
 * Real-time listener for students collection
 */
export function subscribeToStudents(
  onUpdate: (students: Student[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, STUDENTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Student);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore students sync error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for teachers collection
 */
export function subscribeToTeachers(
  onUpdate: (teachers: Teacher[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, TEACHERS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // First-time cloud setup: auto-seed admin teacher so any device can log in immediately
        console.log('Seeding initial admin teacher to Cloud Firestore...');
        try {
          for (const teacher of INITIAL_TEACHERS) {
            await setDoc(doc(db, TEACHERS_COLLECTION, teacher.id), teacher);
          }
        } catch (e) {
          console.error('Failed to seed initial teacher:', e);
        }
        onUpdate(INITIAL_TEACHERS);
        return;
      }

      const list: Teacher[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Teacher);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore teachers sync error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Real-time listener for secret missions collection
 */
export function subscribeToMissions(
  onUpdate: (missions: SecretMission[]) => void,
  onError?: (error: Error) => void
): () => void {
  const colRef = collection(db, MISSIONS_COLLECTION);
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Auto seed initial missions if cloud collection is brand new
        try {
          for (const m of INITIAL_MISSIONS) {
            await setDoc(doc(db, MISSIONS_COLLECTION, m.id), m);
          }
        } catch (e) {
          console.error('Failed to seed initial missions:', e);
        }
        onUpdate(INITIAL_MISSIONS);
        return;
      }

      const list: SecretMission[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SecretMission);
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore missions sync error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a single student to Cloud Firestore
 */
export async function saveStudentToCloud(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, student, { merge: true });
  } catch (err) {
    console.error('Error saving student to cloud:', err);
    throw err;
  }
}

/**
 * Batch save all students to Cloud Firestore (useful for import / full sync)
 */
export async function syncAllStudentsToCloud(students: Student[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    students.forEach((student) => {
      const docRef = doc(db, STUDENTS_COLLECTION, student.id);
      batch.set(docRef, student, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error batch syncing students to cloud:', err);
    throw err;
  }
}

/**
 * Delete a student from Cloud Firestore
 */
export async function deleteStudentFromCloud(studentId: string): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting student from cloud:', err);
    throw err;
  }
}

/**
 * Save or update a teacher in Cloud Firestore
 */
export async function saveTeacherToCloud(teacher: Teacher): Promise<void> {
  try {
    const docRef = doc(db, TEACHERS_COLLECTION, teacher.id);
    await setDoc(docRef, teacher, { merge: true });
  } catch (err) {
    console.error('Error saving teacher to cloud:', err);
    throw err;
  }
}

/**
 * Batch save teachers to Cloud Firestore
 */
export async function syncAllTeachersToCloud(teachers: Teacher[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    teachers.forEach((teacher) => {
      const docRef = doc(db, TEACHERS_COLLECTION, teacher.id);
      batch.set(docRef, teacher, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error batch syncing teachers to cloud:', err);
    throw err;
  }
}

/**
 * Delete a teacher from Cloud Firestore
 */
export async function deleteTeacherFromCloud(teacherId: string): Promise<void> {
  try {
    const docRef = doc(db, TEACHERS_COLLECTION, teacherId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting teacher from cloud:', err);
    throw err;
  }
}

/**
 * Save or update a mission in Cloud Firestore
 */
export async function saveMissionToCloud(mission: SecretMission): Promise<void> {
  try {
    const docRef = doc(db, MISSIONS_COLLECTION, mission.id);
    await setDoc(docRef, mission, { merge: true });
  } catch (err) {
    console.error('Error saving mission to cloud:', err);
    throw err;
  }
}

/**
 * Batch save missions to Cloud Firestore
 */
export async function syncAllMissionsToCloud(missions: SecretMission[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    missions.forEach((mission) => {
      const docRef = doc(db, MISSIONS_COLLECTION, mission.id);
      batch.set(docRef, mission, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    console.error('Error batch syncing missions to cloud:', err);
    throw err;
  }
}
