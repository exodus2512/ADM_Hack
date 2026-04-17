import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { NextRequest } from 'next/server';
import { assertServerOnly, gcpConfig } from '@/lib/gcp/config';

let app: App | null = null;

function getServiceAccountFromEnv() {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n'),
    };
  } catch {
    return null;
  }
}

export function getFirebaseAdminApp(): App | null {
  assertServerOnly();

  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0] as App;
    return app;
  }

  const serviceAccount = getServiceAccountFromEnv();
  if (!serviceAccount) return null;

  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: gcpConfig.firebaseStorageBucket || undefined,
  });

  return app;
}

export async function verifyFirebaseIdToken(req: NextRequest): Promise<string | null> {
  if (!gcpConfig.useFirebaseAuth) return null;

  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;

  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

export function getFirestoreDb() {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  return getFirestore(adminApp);
}

export function getFirebaseStorageBucket() {
  const adminApp = getFirebaseAdminApp();
  if (!adminApp) return null;
  return getStorage(adminApp).bucket();
}
