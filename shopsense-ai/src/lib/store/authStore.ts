import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { getFirebaseClientAuth } from '@/lib/gcp/firebaseClient';
import { upsertUserProfile } from '@/lib/gcp/firebaseAuthService';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  initializing: boolean;
  error: string | null;
  initializeAuthListener: () => () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

let unsubscribeAuth: (() => void) | null = null;

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function toMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code?: string }).code ?? '');
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  return 'Authentication failed. Please try again.';
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initializing: true,
  error: null,
  initializeAuthListener: () => {
    if (unsubscribeAuth) return unsubscribeAuth;

    const auth = getFirebaseClientAuth();
    unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, initializing: false, error: null });
        return;
      }

      set({ user: toAuthUser(firebaseUser), initializing: false, error: null });

      try {
        await upsertUserProfile(firebaseUser);
      } catch {
        // Keep auth state even if Firestore profile sync fails.
      }
    });

    return unsubscribeAuth;
  },
  signInWithGoogle: async () => {
    const auth = getFirebaseClientAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      set({ error: null });
    } catch (error) {
      set({ error: toMessage(error) });
      throw error;
    }
  },
  signInWithEmail: async (email, password) => {
    const auth = getFirebaseClientAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ error: null });
    } catch (error) {
      set({ error: toMessage(error) });
      throw error;
    }
  },
  signUpWithEmail: async (email, password) => {
    const auth = getFirebaseClientAuth();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      set({ error: null });
    } catch (error) {
      set({ error: toMessage(error) });
      throw error;
    }
  },
  signOutUser: async () => {
    const auth = getFirebaseClientAuth();

    try {
      await signOut(auth);
      set({ error: null });
    } catch (error) {
      set({ error: toMessage(error) });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));
