'use client'

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

// Simple loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Initializing application...</p>
      </div>
    </div>
  );
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Mark client as ready after initial render
    setIsClientReady(true);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables loaded for Next-Auth');
    }

    // Preconnect to domains for performance
    const preconnectLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    preconnectLinks.forEach(linkProps => {
      const link = document.createElement('link');
      Object.entries(linkProps).forEach(([attr, value]) => {
        if (value) link.setAttribute(attr, value);
      });
      document.head.appendChild(link);
    });

    return () => {
      // Clean up preconnect links on unmount
      document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]').forEach(el => {
        el.remove();
      });
    };
  }, []);

  if (!isClientReady) {
    return <LoadingFallback />;
  }

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
} 