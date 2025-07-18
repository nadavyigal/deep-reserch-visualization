'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginButton() {
  const { user, loading: authLoading, error: authError, signInWithEmail, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Sync errors from auth context
  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);

  // Handle sign in with credentials
  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail('user@example.com', 'password', rememberMe);
    } catch (error: any) {
      setError(error.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  }, [signInWithEmail, rememberMe]);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (error: any) {
      setError(error.message || 'Sign-out failed');
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  // Loading state
  if (loading || authLoading) {
    return <LoadingButton />;
  }

  // Signed out state
  if (!user) {
    return (
      <div className="w-full max-w-xs mx-auto space-y-3">
        <button
          onClick={handleSignIn}
          className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 
                     rounded-md shadow-sm hover:bg-gray-50 transition-colors"
        >
          <EmailIcon />
          <span className="ml-2">Sign in with Email</span>
        </button>
        
        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-300">
            Remember me
          </label>
        </div>
        
        {error && (
          <div className="p-2 mt-2 text-sm text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Signed in state
  return (
    <div className="w-full max-w-xs mx-auto">
      <button
        onClick={handleSignOut}
        className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white 
                   rounded-md hover:bg-red-700 transition-colors"
      >
        <LogoutIcon />
        <span className="ml-2">Sign out</span>
      </button>
      
      {error && (
        <div className="p-2 mt-2 text-sm text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

// Loading button component
function LoadingButton() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <button 
        disabled
        className="flex items-center justify-center w-full px-4 py-2 bg-gray-200 text-gray-500 
                   rounded-md cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </button>
    </div>
  );
}

// Email icon component
function EmailIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

// Logout icon component
function LogoutIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
} 