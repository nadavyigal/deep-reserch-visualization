'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { auth, initializeFirebase } from '@/lib/firebase/firebase';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { user, loading, error } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Checking...');
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    // Check Firebase configuration
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      setEnvVars(firebaseConfig);
      
      // Check if Firebase is initialized
      const { app, auth: authInstance } = initializeFirebase();
      
      if (app) {
        setFirebaseStatus('Firebase app initialized successfully');
      } else {
        setFirebaseStatus('Firebase app initialization failed');
      }
    } catch (error: any) {
      setFirebaseStatus(`Firebase error: ${error.message || 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug</h1>
      
      <Link 
        href="/"
        className="inline-block mb-8 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to Home
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        
        <div className="space-y-2">
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
          {user && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              <p><strong>User ID:</strong> {user.uid}</p>
              <p><strong>Display Name:</strong> {user.displayName || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>Provider ID:</strong> {user.providerId || 'N/A'}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Firebase Status</h2>
        <p className={firebaseStatus.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {firebaseStatus}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2">
          <p><strong>Auth Domain:</strong> {envVars.authDomain || 'Not set'}</p>
          <p><strong>Project ID:</strong> {envVars.projectId || 'Not set'}</p>
          <p><strong>Storage Bucket:</strong> {envVars.storageBucket || 'Not set'}</p>
          <p><strong>API Key:</strong> {envVars.apiKey ? 'Set (hidden)' : 'Not set'}</p>
          <p><strong>Messaging Sender ID:</strong> {envVars.messagingSenderId ? 'Set' : 'Not set'}</p>
          <p><strong>App ID:</strong> {envVars.appId ? 'Set' : 'Not set'}</p>
        </div>
      </div>
    </div>
  );
} 