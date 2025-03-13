import React from 'react';
import Link from 'next/link';

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/debug" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400">
              Debug
            </Link>
          </div>
          
          <div className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300 rounded-full">
            Debug Mode
          </div>
        </div>
      </header>
      
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}