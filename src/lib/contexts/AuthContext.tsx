"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { 
  signInWithPopup,
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase in client-side only
const getFirebaseAuth = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const app = initializeApp(firebaseConfig);
    return getAuth(app);
  } catch (error) {
    // In case Firebase is already initialized
    return getAuth();
  }
};

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: (rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component that wraps the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState(getFirebaseAuth());

  // Set up auth state listener
  useEffect(() => {
    if (!auth) return;
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (authUser) => {
        setUser(authUser);
        setLoading(false);
      },
      (authError) => {
        setError(authError.message);
        setLoading(false);
      }
    );
    
    // Clean up listener
    return unsubscribe;
  }, [auth]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async (rememberMe = true) => {
    if (!auth) {
      setError("Authentication service unavailable");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      // Set persistence based on user preference
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      
      // Use Google provider with popup
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Handle only specific errors with useful messages
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by your browser');
      } else {
        setError(error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // Sign out
  const signOut = useCallback(async () => {
    if (!auth) return;
    
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (error: any) {
      setError(error.message || 'Failed to sign out');
    }
  }, [auth]);

  // Context value
  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export context
export { AuthContext };
