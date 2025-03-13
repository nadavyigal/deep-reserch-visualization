'use client'

import Link from 'next/link';

export default function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/debug/firebase" 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Firebase Debug</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Check Firebase initialization, authentication status, and environment variables.
          </p>
        </Link>
        
        <Link 
          href="/debug/health" 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Health Check</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View system health status, environment configuration, and API connectivity.
          </p>
        </Link>
        
        <Link 
          href="/api/health" 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          target="_blank"
        >
          <h2 className="text-xl font-semibold mb-2">Health API</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Direct access to the health check API endpoint (raw JSON).
          </p>
        </Link>
        
        <Link 
          href="/" 
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Back to Home</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Return to the main application.
          </p>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Mode Notice</h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          These debug tools are intended for development and troubleshooting purposes only. 
          They may expose sensitive information and should not be accessible in production environments.
        </p>
      </div>
    </div>
  );
}