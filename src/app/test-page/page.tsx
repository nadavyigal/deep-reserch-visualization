'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [testMessage, setTestMessage] = useState('Loading...');

  useEffect(() => {
    setMounted(true);
    setTestMessage('Test page loaded successfully!');

    // Log browser information for debugging
    console.log('Browser information:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Test Page</h1>
        
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-green-600 dark:text-green-300 font-medium">
            {testMessage}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Client-side rendering: {mounted ? 'Active' : 'Pending'}
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/debug/debug-info"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Debug Info
          </Link>
        </div>
      </div>
    </div>
  );
} 