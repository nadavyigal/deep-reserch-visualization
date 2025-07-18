'use client';

/**
 * This utility helps to clean up any potential issues with the project configuration
 */

// Clean up localStorage items that might be causing problems
export const cleanupLocalStorage = () => {
  try {
    // Clear temporary state
    localStorage.removeItem('deepgram_connection_state');
    localStorage.removeItem('deepgram_transcript');
    localStorage.removeItem('deepgram_error');
    
    // Log success
    console.log('✅ LocalStorage cleanup completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error during localStorage cleanup:', error);
    return false;
  }
};

// Check for missing API endpoints
export const checkAPIEndpoints = async () => {
  const results: Record<string, boolean> = {};
  
  try {
    // Check built-in API endpoint
    try {
      const response = await fetch('/api/hello');
      if (response.ok) {
        const data = await response.json();
        results.hello = true;
        console.log('✅ /api/hello endpoint is working:', data);
      } else {
        results.hello = false;
        console.error('❌ /api/hello endpoint returned:', response.status);
      }
    } catch (error) {
      results.hello = false;
      console.error('❌ Error accessing /api/hello endpoint:', error);
    }
    
    // Check if Deepgram endpoint is still being requested
    try {
      const response = await fetch('/api/deepgram');
      if (response.ok) {
        console.warn('⚠️ /api/deepgram endpoint still exists but should be removed');
        results.deepgram = true;
      }
    } catch (error) {
      console.log('✅ /api/deepgram endpoint correctly removed');
      results.deepgram = false;
    }
    
    return results;
  } catch (error) {
    console.error('❌ Error checking API endpoints:', error);
    return results;
  }
};

// Check Firebase configuration
export const checkFirebaseConfig = () => {
  const results: Record<string, boolean | string> = {};
  
  try {
    // Check environment variables
    results.apiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    results.authDomain = !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    results.projectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    // Log results
    console.log('Firebase environment variables check:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Error checking Firebase config:', error);
    return { error: String(error) };
  }
};

// Check browser environment
export const checkBrowserEnvironment = () => {
  const results: Record<string, any> = {};
  
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('⚠️ Not running in browser environment');
      return { browserAvailable: false };
    }
    
    // Check browser capabilities and versions
    results.browserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      platform: navigator.platform,
      vendor: navigator.vendor,
    };
    
    // Check for any polyfills or missing features
    results.features = {
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
    };
    
    console.log('Browser environment check:', results);
    return results;
  } catch (error) {
    console.error('❌ Error checking browser environment:', error);
    return { error: String(error) };
  }
};

// Export a function to run all checks
export const runAllChecks = async () => {
  const results = {
    localStorage: cleanupLocalStorage(),
    api: await checkAPIEndpoints(),
    firebase: checkFirebaseConfig(),
    browser: checkBrowserEnvironment()
  };
  
  console.log('All diagnostic checks complete:', results);
  return results;
}; 