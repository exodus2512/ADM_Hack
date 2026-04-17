import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseClientConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

export function getFirebaseClientApp() {
  if (!isFirebaseClientConfigured()) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseClientAuth() {
  const app = getFirebaseClientApp();
  if (!app) return null;
  return getAuth(app);
}

export function getFirebaseClientDb() {
  const app = getFirebaseClientApp();
  if (!app) return null;
  return getFirestore(app);
}

export async function getFirebaseClientAnalytics() {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseClientApp();
  if (!app) return null;
  if (!(await isSupported())) return null;
  return getAnalytics(app);
}
