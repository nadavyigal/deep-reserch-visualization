'use client'

import React from 'react';
import AppLayout from '../components/AppLayout';
import ResearchView from '../components/ResearchView';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ResearchPage() {
  const { user, loading } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ResearchView />
      </div>
    </AppLayout>
  );
} 