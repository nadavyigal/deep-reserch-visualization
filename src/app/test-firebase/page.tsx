'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from '@/app/components/LoginButton';

export default function TestFirebase() {
  const { user, loading, error } = useAuth();
  const [configStatus, setConfigStatus] = useState<'loading' | 'valid' | 'invalid' | 'error'>('loading');
  const [configData, setConfigData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check Firebase config via API
  useEffect(() => {
    async function checkConfig() {
      try {
        const response = await fetch('/api/test-firebase');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setConfigData(data);
        setConfigStatus(data.configStatus || 'error');
      } catch (error) {
        console.error('Error checking Firebase config:', error);
        setConfigStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error checking config');
      }
    }

    checkConfig();
  }, []);

  // Check environment variables on the client
  const clientEnvCheck = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'present' : 'missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'present' : 'missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'present' : 'missing',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Firebase Authentication Test
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Check if Firebase is configured correctly and authentication works
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          {/* Authentication Status */}
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Authentication Status
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              {loading ? (
                <div className="text-amber-600 dark:text-amber-400">Loading authentication...</div>
              ) : error ? (
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : user ? (
                <div className="text-green-600 dark:text-green-400">
                  <p>Signed in successfully!</p>
                  <p className="text-sm">Email: {user.email}</p>
                </div>
              ) : (
                <div className="text-blue-600 dark:text-blue-400">Not signed in</div>
              )}
            </div>
            <div className="mt-4">
              <LoginButton />
            </div>
          </div>

          {/* Configuration Status */}
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Firebase Configuration
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              {configStatus === 'loading' ? (
                <div className="text-amber-600 dark:text-amber-400">Checking configuration...</div>
              ) : configStatus === 'error' ? (
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-medium">Error checking configuration:</p>
                  <p className="text-sm">{errorMessage || 'Unknown error'}</p>
                </div>
              ) : configStatus === 'invalid' ? (
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-medium">Invalid configuration!</p>
                  {configData?.missingFields && (
                    <p className="text-sm">
                      Missing fields: {configData.missingFields.join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-green-600 dark:text-green-400">
                  <p className="font-medium">Valid configuration!</p>
                  <p className="text-sm">Environment: {configData?.environment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Client-side Environment Variables */}
          <div>
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Client Environment Variables
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-sm font-mono">
              <p>NEXT_PUBLIC_FIREBASE_API_KEY: {clientEnvCheck.apiKey}</p>
              <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {clientEnvCheck.authDomain}</p>
              <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID: {clientEnvCheck.projectId}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Note: These values should all be &quot;present&quot; for Firebase to work correctly.
            </p>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
              Troubleshooting
            </h2>
            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>Check that your .env.local file has the correct Firebase config values</li>
              <li>Make sure you&apos;ve enabled Google authentication in your Firebase console</li>
              <li>Verify that your Firebase project is active and not disabled</li>
              <li>Clear your browser cache and cookies if you&apos;re experiencing issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 