'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';

// Mock Better Auth implementation
class MockBetterAuth {
  private listeners: ((user: any | null) => void)[] = [];
  private currentUser: any = null;
  
  constructor(config: any) {
    console.log('Initializing Mock BetterAuth with config:', config);
  }
  
  async getCurrentUser() {
    return this.currentUser;
  }
  
  onAuthStateChanged(callback: (user: any | null) => void) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  async signInWithEmail(email: string, password: string, options?: any) {
    console.log(`Mock: Signing in with email: ${email}`);
    this.currentUser = {
      id: 'mock-user-id',
      email,
      emailVerified: true,
      createdAt: new Date(),
      metadata: {}
    };
    this.notifyListeners();
    return this.currentUser;
  }
  
  async signInWithOAuth(provider: string) {
    console.log(`Mock: Signing in with ${provider}`);
    this.currentUser = {
      id: 'mock-oauth-user-id',
      email: `user@${provider}.example.com`,
      emailVerified: true,
      createdAt: new Date(),
      metadata: { provider }
    };
    this.notifyListeners();
    return this.currentUser;
  }
  
  async signOut() {
    console.log('Mock: Signing out');
    this.currentUser = null;
    this.notifyListeners();
  }
  
  async signUp(email: string, password: string) {
    console.log(`Mock: Signing up with email: ${email}`);
    this.currentUser = {
      id: 'mock-new-user-id',
      email,
      emailVerified: false,
      createdAt: new Date(),
      metadata: {}
    };
    this.notifyListeners();
    return this.currentUser;
  }
  
  async resetPassword(email: string) {
    console.log(`Mock: Password reset for email: ${email}`);
    return true;
  }
  
  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }
}

// Initialize Mock Better Auth
const betterAuth = new MockBetterAuth({
  apiKey: process.env.NEXT_PUBLIC_BETTER_AUTH_API_KEY || 'demo_key',
});

// Define user type
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Context type
interface BetterAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create context with default values
export const BetterAuthContext = createContext<BetterAuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  resetPassword: async () => {},
});

// Provider component
export function BetterAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const currentUser = await betterAuth.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            emailVerified: currentUser.emailVerified || false,
            createdAt: currentUser.createdAt || new Date(),
            metadata: currentUser.metadata,
          });
        }
      } catch (err: any) {
        console.error('Error getting current user:', err);
        setError(err.message || 'Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const unsubscribe = betterAuth.onAuthStateChanged((authUser: any) => {
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          emailVerified: authUser.emailVerified || false,
          createdAt: authUser.createdAt || new Date(),
          metadata: authUser.metadata,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signInWithEmail = useCallback(async (email: string, password: string, rememberMe = true) => {
    try {
      setError(null);
      setLoading(true);
      await betterAuth.signInWithEmail(email, password, {
        persistSession: rememberMe,
      });
    } catch (err: any) {
      console.error('Error signing in with email:', err);
      setError(err.message || 'Failed to sign in with email and password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      await betterAuth.signInWithOAuth('google');
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      await betterAuth.signOut();
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await betterAuth.signUp(email, password);
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await betterAuth.resetPassword(email);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    signUp,
    resetPassword,
  };

  return (
    <BetterAuthContext.Provider value={value}>
      {children}
    </BetterAuthContext.Provider>
  );
} 