'use client'

import React from 'react'
import { Providers } from './providers'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { BetterAuthProvider } from '@/lib/contexts/BetterAuthContext'
import { DeepgramProvider } from '@/lib/contexts/DeepgramContext'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const useBetterAuth = process.env.NEXT_PUBLIC_USE_BETTER_AUTH === 'true'
  const AuthWrapper = useBetterAuth ? BetterAuthProvider : AuthProvider

  return (
    <AuthWrapper>
      <DeepgramProvider>
        <Providers>{children}</Providers>
      </DeepgramProvider>
    </AuthWrapper>
  )
}