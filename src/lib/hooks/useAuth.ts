'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

/**
 * Custom hook for accessing authentication state and methods
 * Uses Next-Auth for authentication functionality
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);

  const isLoading = status === "loading";

  const signInWithEmail = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      setAuthError(null);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        setAuthError(result.error);
        throw new Error(result.error);
      }
      
      return result;
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthError(null);
      await signOut({ callbackUrl: '/' });
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    }
  };

  return {
    user: session?.user || null,
    loading: isLoading,
    error: authError,
    signInWithEmail,
    signOut: handleSignOut
  };
}