"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithPopup, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  getRedirectResult,
  signOut as firebaseSignOut,
  setPersistence,
  inMemoryPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  Auth
} from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "../firebase/firebase";

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps your app and makes auth object available
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for redirect result on initial load
  useEffect(() => {
    if (!isClient) return; // Skip on server-side

    const checkRedirectResult = async () => {
      try {
        // Check if there's a redirect result
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('User signed in after redirect:', result.user.email);
          setUser(result.user);
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    checkRedirectResult();
  }, [isClient]);

  // Listen for auth state changes
  useEffect(() => {
    if (!isClient) return; // Skip on server-side

    console.log('Setting up auth state listener');
    
    // Check if auth is properly initialized
    if (!auth || !('onAuthStateChanged' in auth)) {
      console.error('Auth object is not properly initialized');
      setError('Authentication service is not available. Please try again later.');
      setLoading(false);
      return () => {};
    }
    
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
        console.log('Auth state changed:', user?.email || 'No user');
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [isClient]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isClient) {
      console.error('Cannot sign in on server side');
      return;
    }

    // Check if auth is properly initialized
    if (!auth || !('signInWithPopup' in auth)) {
      console.error('Auth object is not properly initialized for sign in');
      setError('Authentication service is not available. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to sign in with Google...');
      const provider = new GoogleAuthProvider();
      
      // Add scopes if needed
      // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      
      // Optional: Specify custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Set persistence to LOCAL (survives browser restarts)
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
      
      // You can access the Google Access Token here if needed
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing the sign-in.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by the browser. Please allow popups for this site.');
        
        // Try redirect method as fallback
        try {
          console.log('Attempting to sign in with redirect as fallback...');
          await signInWithRedirect(auth, new GoogleAuthProvider());
        } catch (redirectError: any) {
          console.error('Error signing in with redirect:', redirectError);
          setError(redirectError.message || 'Failed to sign in with Google redirect');
        }
      } else {
        setError(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    if (!isClient) {
      console.error('Cannot sign out on server side');
      return;
    }

    // Check if auth is properly initialized
    if (!auth || !('signOut' in auth)) {
      console.error('Auth object is not properly initialized for sign out');
      setError('Authentication service is not available. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Use a default value for server-side rendering
  const value = {
    user,
    loading: isClient ? loading : true, // Always show loading on server-side
    error,
    signInWithGoogle,
    signOut: signOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };