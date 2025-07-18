'use client'

import AppLayout from '../components/AppLayout';
import AuthForm from '../components/AuthForm';
import UserProfile from '../components/UserProfile';

export default function AuthTestPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
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
      </div>
    </AppLayout>
  );
} 