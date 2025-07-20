'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

// Simple standalone component for testing auth
export default function AuthTest() {
  const { user, loading, error, signInWithGoogle, signOut } = useAuth();
  const [authStatus, setAuthStatus] = useState<string>('Checking authentication status...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('user@example.com');
  const [password, setPassword] = useState<string>('password');

  // Update auth status when auth state changes
  useEffect(() => {
    if (loading) {
      setAuthStatus('Loading authentication state...');
    } else if (error) {
      setAuthStatus('Authentication error');
      setErrorMessage(error);
    } else if (user) {
      setAuthStatus(`Signed in as ${user.email || user.displayName || 'User'}`);
    } else {
      setAuthStatus('Not signed in');
    }
  }, [user, loading, error]);

  // Handle sign in
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMessage(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await signOut();
    } catch (err: any) {
      console.error('Sign out error:', err);
      setErrorMessage(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Test Page</h1>

        {/* Auth Status */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h2 className="font-semibold mb-2">Status:</h2>
          <p>{authStatus}</p>
          {errorMessage && (
            <p className="mt-2 text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* Login Form */}
        {!user && (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {/* Auth Buttons */}
        <div className="flex flex-col gap-4 mb-6">
          {!user ? (
            <button
              onClick={handleSignIn}
              disabled={isLoading || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || loading ? 'Signing in...' : 'Sign in'}
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              disabled={isLoading || loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || loading ? 'Signing out...' : 'Sign out'}
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a 
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
} 