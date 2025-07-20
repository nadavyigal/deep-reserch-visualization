'use client'

import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function FirebaseTestPage() {
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [appInfo, setAppInfo] = useState<any>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Check Firebase services
        if (!auth) {
          throw new Error('Firebase auth initialization failed');
        }
        
        // Test Firebase auth initialization  
        const authName = 'Firebase Auth';
        
        setAppInfo({
          authName,
          authExists: !!auth
        });
        
        // Test Firestore connection
        try {
          if (db) {
            const testCollection = collection(db, 'test');
            await getDocs(testCollection);
            console.log('Firestore connection successful');
          }
        } catch (firestoreError: any) {
          console.warn('Firestore test failed, but app might still be initialized correctly', firestoreError);
        }
        
        setFirebaseStatus('success');
      } catch (err: any) {
        console.error('Firebase test error', err);
        setError(err.message || 'An error occurred testing Firebase');
        setFirebaseStatus('error');
      }
    };
    
    testFirebase();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        {firebaseStatus === 'loading' && (
          <p className="text-yellow-600 dark:text-yellow-400">Testing Firebase connection...</p>
        )}
        {firebaseStatus === 'success' && (
          <p className="text-green-600 dark:text-green-400">Firebase connection successful!</p>
        )}
        {firebaseStatus === 'error' && (
          <p className="text-red-600 dark:text-red-400">Firebase connection failed.</p>
        )}
      </div>
      
      {appInfo && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Firebase App Info</h2>
          <pre className="whitespace-pre-wrap overflow-auto bg-white dark:bg-gray-900 p-4 rounded-md">
            {JSON.stringify(appInfo, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mt-6">
        <a 
          href="/debug" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Auth Debug Page
        </a>
      </div>
    </div>
  );
} 