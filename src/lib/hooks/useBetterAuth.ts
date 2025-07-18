'use client';

import { useContext } from 'react';
import { BetterAuthContext } from '../contexts/BetterAuthContext';

/**
 * Custom hook for accessing Better Auth authentication state and methods
 * Uses the BetterAuthContext to provide Better Auth functionality
 */
export const useBetterAuth = () => {
  const context = useContext(BetterAuthContext);
  
  if (!context) {
    throw new Error('useBetterAuth must be used within a BetterAuthProvider');
  }
  
  return context;
}; 