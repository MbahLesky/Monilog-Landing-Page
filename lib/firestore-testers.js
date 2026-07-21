'use client';

import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getFirestore_ } from './firebase';

/**
 * Stores a tester in Firestore under the 'testers' collection.
 * @param {string} uuid - The tester's unique ID (typically from Firebase Auth)
 * @param {object} data - Tester data { name, email, phone, code }
 * @returns {Promise<void>}
 */
export async function storeTester(uuid, { name, email, phone = '', code = '' }) {
  const db = getFirestore_();
  if (!db) throw new Error('Firestore not initialized');

  const testerRef = doc(collection(db, 'testers'), uuid);
  // Merged so re-registering never clears fields written elsewhere — notably the
  // beta agreement acceptance.
  await setDoc(
    testerRef,
    {
      name: name || '',
      email: email || '',
      phone: phone || '',
      code: code || '',
      createdAt: new Date().toISOString()
    },
    { merge: true }
  );
}

/**
 * Reads a tester document.
 * @param {string} uuid - The tester's unique ID
 * @returns {Promise<object|null>} - Tester data, or null when missing/unavailable
 */
export async function getTester(uuid) {
  const db = getFirestore_();
  if (!db) return null;

  const snapshot = await getDoc(doc(collection(db, 'testers'), uuid));
  return snapshot.exists() ? snapshot.data() : null;
}

/**
 * Records that a tester accepted the beta agreement. Stored with the version so
 * a future revision of the terms can re-prompt testers who accepted an older one.
 * @param {string} uuid - The tester's unique ID
 * @param {object} data - { version, name }
 * @returns {Promise<void>}
 */
export async function recordAgreementAcceptance(uuid, { version, name = '' }) {
  const db = getFirestore_();
  if (!db) throw new Error('Firestore not initialized');

  const testerRef = doc(collection(db, 'testers'), uuid);
  await setDoc(
    testerRef,
    {
      agreement: {
        version,
        signedName: name || '',
        acceptedAt: new Date().toISOString()
      }
    },
    { merge: true }
  );
}

/**
 * Fetches beta code information from Firestore.
 * @param {string} code - The beta code to look up
 * @returns {Promise<object|null>} - Beta code document data or null if not found
 */
export async function getBetaCodeInfo(code) {
  const db = getFirestore_();
  if (!db) throw new Error('Firestore not initialized');

  const normalizedCode = code?.trim().toUpperCase();
  if (!normalizedCode) return null;

  const q = query(collection(db, 'beta-codes'), where('code', '==', normalizedCode));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  };
}

/**
 * Fetches all active beta codes (for admin or reference).
 * @returns {Promise<array>} - Array of active beta code documents
 */
export async function getActiveBetaCodes() {
  const db = getFirestore_();
  if (!db) throw new Error('Firestore not initialized');

  const q = query(collection(db, 'beta-codes'), where('active', '==', true));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Gets organization name from a beta code.
 * @param {string} code - The beta code
 * @returns {Promise<string|null>} - Organization name or null
 */
export async function getOrgNameForCode(code) {
  const codeInfo = await getBetaCodeInfo(code);
  return codeInfo?.organisation_name || null;
}
