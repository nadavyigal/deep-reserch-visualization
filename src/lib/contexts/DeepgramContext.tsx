'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface DeepgramContextType {
  apiKey: string;
  isLoading: boolean;
  error: string | null;
}

// Create a default context value to avoid null checks
const defaultContextValue: DeepgramContextType = {
  apiKey: '',
  isLoading: true,
  error: null
};

const DeepgramContext = createContext<DeepgramContextType>(defaultContextValue);

// Custom hook to use the Deepgram context
export const useDeepgram = () => {
  const context = useContext(DeepgramContext);
  
  if (!context) {
    throw new Error('useDeepgram must be used within a DeepgramProvider');
  }
  
  return context;
};

interface DeepgramProviderProps {
  children: React.ReactNode;
}

// The provider component that will fetch and provide the Deepgram API key
export function DeepgramProvider({ children }: DeepgramProviderProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // Define a memoized fetch function to prevent recreation on each render
  const fetchApiKey = useMemo(() => {
    return async () => {
      // Avoid duplicate fetches
      if (isFetching) return;
      
      setIsFetching(true);
      
      try {
        // Use AbortController for timeout management
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/deepgram/transcribe-audio', {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Deepgram API key: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.apiKey) {
          throw new Error('Invalid response: API key not found');
        }
        
        setApiKey(data.apiKey);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching Deepgram API key:', err);
        setError(err.message || 'Failed to fetch Deepgram API key');
        
        // Implement retry logic with backoff if needed
        if (err.name !== 'AbortError') {
          // Save error for debugging
          try {
            localStorage.setItem('deepgram_api_error', JSON.stringify({
              timestamp: new Date().toISOString(),
              error: err.message || 'Unknown error'
            }));
          } catch (e) {
            // Ignore storage errors
          }
        }
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };
  }, [isFetching]);

  // Fetch the API key on component mount
  useEffect(() => {
    // Use a microtask to avoid blocking render
    Promise.resolve().then(() => {
      if (!apiKey && !error) {
        fetchApiKey();
      }
    });
    
    return () => {
      // Cleanup if needed
    };
  }, [apiKey, error, fetchApiKey]);

  // Memoize the context value to prevent unnecessary renders of consuming components
  const contextValue = useMemo(() => ({
    apiKey,
    isLoading,
    error
  }), [apiKey, isLoading, error]);

  return (
    <DeepgramContext.Provider value={contextValue}>
      {children}
    </DeepgramContext.Provider>
  );
} 