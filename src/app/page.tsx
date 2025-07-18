'use client'

import AuthForm from '@/app/components/AuthForm';
import UserProfile from '@/app/components/UserProfile';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col gap-8">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-center mb-12">Authentication Demo</h1>
          
          <div className="p-4 mb-6 bg-blue-100 border border-blue-400 text-blue-800 rounded">
            <p className="font-medium">📝 Authentication Instructions</p>
            <p>Use these test credentials to log in: <strong>user@example.com</strong> / <strong>password</strong></p>
            <p className="mt-2 text-sm">Note: Only email/password login is available in this demo. Google OAuth has been disabled.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Sign In</h2>
              <AuthForm />
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">User Profile</h2>
              <UserProfile />
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">About This Implementation</h2>
            <p className="mb-4">
              This is a demonstration of NextAuth.js integration with Next.js App Router and React.
              NextAuth.js is a complete authentication solution that provides:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Secure JWT-based authentication</li>
              <li>Credentials-based authentication</li>
              <li>Session management</li>
              <li>CSRF protection</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
