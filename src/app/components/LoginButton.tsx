'use client'

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginButton() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  // Handle sign in with Google
  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error in sign in handler:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error in sign out handler:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading || authLoading) {
    return (
      <button 
        disabled
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-md w-full max-w-xs mx-auto cursor-not-allowed"
      >
        <LoadingSpinner />
        <span>Loading...</span>
      </button>
    );
  }

  // Show sign in button if user is not logged in
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 w-full max-w-xs mx-auto transition-colors"
      >
        <GoogleIcon />
        <span>Sign in with Google</span>
      </button>
    );
  }

  // Show sign out button if user is logged in
  return (
    <button
      onClick={handleSignOut}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full max-w-xs mx-auto transition-colors"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v1a1 1 0 102 0V9z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>Sign Out</span>
    </button>
  );
}

// Google icon component
function GoogleIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      className="w-5 h-5"
    >
      <path 
        fill="#FFC107" 
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" 
      />
      <path 
        fill="#FF3D00" 
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" 
      />
      <path 
        fill="#4CAF50" 
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" 
      />
      <path 
        fill="#1976D2" 
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" 
      />
    </svg>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin h-5 w-5 text-gray-500" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}