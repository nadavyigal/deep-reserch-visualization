'use client'

import { useState, useEffect } from 'react';
import { cleanupLocalStorage, checkAPIEndpoints, checkFirebaseConfig, runAllChecks } from './cleanup';

export default function DebugInfo() {
  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    
    // Override console methods to capture logs
    const originalError = console.error;
    const originalLog = console.log;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      setErrors(prev => [...prev, args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')]);
      originalError.apply(console, args);
    };
    
    console.log = (...args) => {
      setLogs(prev => [...prev, args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')]);
      originalLog.apply(console, args);
    };
    
    console.warn = (...args) => {
      setLogs(prev => [...prev, `[WARN] ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`]);
      originalWarn.apply(console, args);
    };
    
    // Log browser information
    console.log('Browser Debug Info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
    });
    
    // Check for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    });
    
    // Check for JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript Error:', event.message, 'at', event.filename, 'line', event.lineno);
    });
    
    // Return cleanup function
    return () => {
      console.error = originalError;
      console.log = originalLog;
      console.warn = originalWarn;
    };
  }, [initialized]);
  
  const handleRunChecks = async () => {
    try {
      console.log('Running diagnostic checks...');
      const results = await runAllChecks();
      setDiagnosticResults(results);
    } catch (error) {
      console.error('Error running diagnostic checks:', error);
    }
  };
  
  const handleCleanup = async () => {
    try {
      console.log('Running cleanup...');
      const result = cleanupLocalStorage();
      console.log('Cleanup completed:', result ? 'Successfully' : 'With errors');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Browser Debug Information</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleRunChecks}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Run Diagnostic Checks
        </button>
        
        <button 
          onClick={handleCleanup}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Run Cleanup
        </button>
      </div>
      
      {diagnosticResults && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Diagnostic Results</h2>
          <pre className="whitespace-pre-wrap overflow-auto bg-white dark:bg-gray-900 p-4 rounded-md">
            {JSON.stringify(diagnosticResults, null, 2)}
          </pre>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-2 text-red-600">Errors</h2>
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-h-96 overflow-auto">
        {errors.length === 0 ? (
          <p className="text-gray-500">No errors captured</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {errors.map((error, i) => (
              <li key={i} className="text-red-600">{error}</li>
            ))}
          </ul>
        )}
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Console Logs</h2>
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-96 overflow-auto">
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs captured</p>
        ) : (
          <ul className="list-none space-y-1">
            {logs.map((log, i) => (
              <li key={i} className="font-mono text-sm">{log}</li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Test API Connection</h2>
        <button 
          onClick={async () => {
            try {
              console.log('Testing connection to API...');
              const response = await fetch('/api/hello');
              const data = await response.json();
              console.log('API Response:', data);
            } catch (err) {
              console.error('API Connection Error:', err);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
} 