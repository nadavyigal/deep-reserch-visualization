'use client'

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase/firebase';
import { signInWithPopup, GoogleAuthProvider, User, Auth, AuthError } from 'firebase/auth';
import Link from 'next/link';

export default function DebugPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the actual Auth instance from the auth object
    const firebaseAuth = auth.instance;
    if (!firebaseAuth) {
      console.error('Firebase Auth is not initialized');
      setError('Firebase Auth is not initialized. Check your Firebase configuration.');
      return () => {};
    }

    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthState({
        user: currentUser ? {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        } : null,
        isAuthenticated: !!currentUser
      });
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setError(null);
      // Get the actual Auth instance
      const firebaseAuth = auth.instance;
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized');
      }
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      console.log('Sign in successful', result.user);
    } catch (err: any) {
      console.error('Sign in error', err);
      setError(err.message || 'An error occurred during sign in');
    }
  };

  const handleSignOut = async () => {
    try {
      setError(null);
      // Get the actual Auth instance
      const firebaseAuth = auth.instance;
      if (!firebaseAuth) {
        throw new Error('Firebase Auth is not initialized');
      }
      
      await firebaseAuth.signOut();
      console.log('Sign out successful');
    } catch (err: any) {
      console.error('Sign out error', err);
      setError(err.message || 'An error occurred during sign out');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Authentication Debug</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Authentication State</h2>
        <pre className="whitespace-pre-wrap overflow-auto bg-white dark:bg-gray-900 p-4 rounded-md">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex gap-4 mb-6">
        {!user ? (
          <button 
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Sign In with Google
          </button>
        ) : (
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>

      <div className="mt-6">
        <Link 
          href="/debug/debug-info"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-block"
        >
          Advanced Browser Debugging
        </Link>
      </div>
    </div>
  );
} 