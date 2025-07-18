'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AuthForm() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    signInWithEmail,
    loading, 
    error: authError 
  } = useAuth();

  // Update the form error when the auth error changes
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password, rememberMe);
        console.log('Sign in successful');
      } else {
        // For demo purposes, just inform the user to use the test account
        setFormError('Sign up is disabled in this demo. Please use test account: user@example.com / password');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setFormError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setFormError('Please enter your email address to reset your password');
      return;
    }
    
    // For demo purposes, just inform the user
    setFormError('Password reset is disabled in this demo. Please use test account: user@example.com / password');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      
      {(formError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {mode === 'signin' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </button>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {loading || isSubmitting ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Demo credentials: user@example.com / password</p>
      </div>
    </div>
  );
} 