'use client'

import React from 'react';
import { Providers } from './providers';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Providers>
        {children}
      </Providers>
    </AuthProvider>
  );
}