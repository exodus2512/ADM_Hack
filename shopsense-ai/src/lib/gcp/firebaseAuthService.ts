import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirebaseClientDb } from '@/lib/gcp/firebaseClient';

export async function upsertUserProfile(user: User): Promise<void> {
  const db = getFirebaseClientDb();
  if (!db) return;

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      providerId: user.providerData?.[0]?.providerId ?? 'unknown',
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
