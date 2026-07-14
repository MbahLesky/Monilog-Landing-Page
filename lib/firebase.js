import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let authInstance = null;
let firestoreInstance = null;

// Lazily initialize Firebase Auth in the browser only. getAuth() validates the
// API key eagerly and throws during server prerender when env vars are absent,
// so we never call it on the server. Returns null when auth can't be used
// (server render, or missing config) — callers guard on that.
export function getFirebaseAuth() {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.apiKey) return null;
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
}

// Lazily initialize Firestore in the browser only. Returns null when Firestore
// can't be used (server render, or missing config) — callers guard on that.
export function getFirestore_() {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.projectId) return null;
  if (!firestoreInstance) firestoreInstance = getFirestore(app);
  return firestoreInstance;
}
