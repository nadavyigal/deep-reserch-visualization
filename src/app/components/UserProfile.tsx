'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UserProfile() {
  const { user, loading, error, signOut } = useAuth();

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <div className="animate-pulse">
          <div className="rounded-full bg-gray-300 h-24 w-24 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded mb-6 w-1/2 mx-auto"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <p className="text-lg mb-4">You are not signed in.</p>
        <p className="text-sm text-gray-500 mb-4">
          Sign in to view your profile and access all features.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
            </span>
          )}
        </div>
        <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
        <p className="text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-2">Account Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-sm truncate max-w-[180px]">{user.uid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span>{user.displayName || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => signOut()}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 