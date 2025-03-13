'use client'

import { useAuth } from '@/lib/hooks/useAuth';
import LoginButton from '@/app/components/LoginButton';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8">Deep Research Visualization</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-300">Checking authentication status...</p>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">Welcome back!</h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.displayName || user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to continue</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mb-6">
            <LoginButton />
          </div>
          
          {/* Debug Tools Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/debug"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              Debug Tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}