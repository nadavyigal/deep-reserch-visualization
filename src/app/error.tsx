'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error component caught the following error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Something went wrong!
        </h1>
        
        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-300 text-sm break-words whitespace-pre-wrap">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-red-500 text-xs mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
          >
            Go Home
          </button>
          
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
} 