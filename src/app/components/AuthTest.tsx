'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';

export default function AuthTest() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [authStatus, setAuthStatus] = useState<string>('Checking authentication...');

  useEffect(() => {
    if (loading) {
      setAuthStatus('Loading authentication status...');
    } else if (user) {
      setAuthStatus(`Authenticated as ${user.displayName || user.email}`);
    } else {
      setAuthStatus('Not authenticated');
    }
  }, [user, loading]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Next Auth Test</h2>
      <div className="mb-4">
        <p className="font-medium">Status: <span className={user ? "text-green-600" : "text-red-600"}>{authStatus}</span></p>
      </div>
      <div className="flex gap-4">
        {!user ? (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign in with Test Account
          </button>
        ) : (
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
} 