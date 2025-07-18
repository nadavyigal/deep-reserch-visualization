'use client'

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/hooks/useAuth';

export default function FirebaseDebugPage() {
  const { user, loading, error } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<{
    auth: boolean;
    db: boolean;
    storage: boolean;
  }>({
    auth: false,
    db: false,
    storage: false
  });
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});
  const [logs, setLogs] = useState<string[]>([]);

  // Helper function to add log messages
  const logDebug = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, `${new Date().toISOString().slice(11, 19)} - ${message}`]);
  };

  // Check Firebase services
  useEffect(() => {
    // Check if Firebase services are initialized
    const checkFirebaseServices = () => {
      logDebug('Checking Firebase services...');
      
      // Check Auth
      const authInitialized = auth && 'currentUser' in auth;
      setFirebaseStatus(prev => ({ ...prev, auth: authInitialized }));
      logDebug(`Auth service initialized: ${authInitialized}`);
      
      // Check Firestore
      const dbInitialized = db && 'collection' in db;
      setFirebaseStatus(prev => ({ ...prev, db: dbInitialized }));
      logDebug(`Firestore service initialized: ${dbInitialized}`);
      
      // Check Storage
      const storageInitialized = storage && 'ref' in storage;
      setFirebaseStatus(prev => ({ ...prev, storage: storageInitialized }));
      logDebug(`Storage service initialized: ${storageInitialized}`);
    };
    
    // Check environment variables
    const checkEnvVars = () => {
      logDebug('Checking environment variables...');
      const vars = {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      setEnvVars(vars);
      
      // Log which variables are set
      Object.entries(vars).forEach(([key, value]) => {
        logDebug(`${key}: ${value ? 'Set' : 'Not set'}`);
      });
    };
    
    checkFirebaseServices();
    checkEnvVars();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Firebase Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Firebase Status Panel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Firebase Services Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${firebaseStatus.auth ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Authentication: {firebaseStatus.auth ? 'Initialized' : 'Not Initialized'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${firebaseStatus.db ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Firestore: {firebaseStatus.db ? 'Initialized' : 'Not Initialized'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${firebaseStatus.storage ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Storage: {firebaseStatus.storage ? 'Initialized' : 'Not Initialized'}</span>
            </div>
          </div>
        </div>
        
        {/* Environment Variables Panel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-mono text-sm">{key}: {value ? 'Set' : 'Not Set'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Auth Status */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500' : user ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          
          {error && (
            <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
        
        {user && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
            <h3 className="font-medium mb-2">Current User</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                emailVerified: user.emailVerified,
                isAnonymous: user.isAnonymous,
                providerData: user.providerData,
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Debug Logs */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Logs</h2>
        <div className="bg-black text-green-400 font-mono text-sm p-4 rounded h-48 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet...</p>
          ) : (
            logs.map((log, index) => <div key={index}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
} 