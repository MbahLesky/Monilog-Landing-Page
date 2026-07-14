import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Server-only Firebase Admin SDK. Never import this from a client component.
// Credentials come from a service account exposed via server env vars. The
// private key is stored with literal "\n" sequences (single-line env value) and
// unescaped to real newlines here.
let authInstance = null;
let firestoreInstance = null;

function getAdminApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin is not configured (missing service account env vars).');
  }

  const existing = getApps()[0];
  if (existing) return existing;
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function getAdminAuth() {
  if (!authInstance) authInstance = getAuth(getAdminApp());
  return authInstance;
}

export function getAdminFirestore() {
  if (!firestoreInstance) firestoreInstance = getFirestore(getAdminApp());
  return firestoreInstance;
}
