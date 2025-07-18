import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug log in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Firebase Config] Environment variables loaded:', {
    apiKey: firebaseConfig.apiKey ? '✓ Present' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Present' : '✗ Missing',
    projectId: firebaseConfig.projectId ? '✓ Present' : '✗ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✓ Present' : '✗ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Present' : '✗ Missing',
    appId: firebaseConfig.appId ? '✓ Present' : '✗ Missing',
  });
}

// Check if all required Firebase config values are present
const isFirebaseConfigValid = () => {
  const requiredFields = [
    'apiKey', 
    'authDomain', 
    'projectId'
  ];
  
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

// Ensure Firebase config is valid - add an explicit safety check
if (typeof window !== 'undefined' && !isFirebaseConfigValid()) {
  console.error('⚠️ CRITICAL: Firebase configuration is invalid. Authentication will not work.');
  
  // Add values directly for testing in development
  if (process.env.NODE_ENV === 'development') {
    // This is a safety mechanism for development only
    console.warn('🛠️ Development mode: using fallback Firebase config for testing');
    firebaseConfig.apiKey = firebaseConfig.apiKey || 'AIzaSyAwqTC8PhZ9BSbsbvwixBRzu7fJFMi5swU';
    firebaseConfig.authDomain = firebaseConfig.authDomain || 'deep-research-visualization.firebaseapp.com';
    firebaseConfig.projectId = firebaseConfig.projectId || 'deep-research-visualization';
  }
}

// Simplified service instances with lazy initialization pattern
let firebaseApp: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let storageInstance: FirebaseStorage | undefined;

// Initialization status tracking
let isInitializing = false;
let initializationError: Error | null = null;
let initializationPromise: Promise<{ app: FirebaseApp | undefined }> | null = null;

// Helper to safely initialize and get Firebase app
const safelyGetFirebaseApp = (): FirebaseApp | undefined => {
  try {
    // Use existing app if available
    if (getApps().length > 0) {
      return getApp();
    }
    
    // Validate config before attempting initialization
    if (!isFirebaseConfigValid()) {
      console.error('[Firebase] Cannot initialize app with invalid config');
      return undefined;
    }
    
    // Initialize new app
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('[Firebase] Error in app initialization:', error);
    return undefined;
  }
};

// Internal function to initialize Firebase core
const initializeFirebaseInternal = (): { app: FirebaseApp | undefined } | Promise<{ app: FirebaseApp | undefined }> => {
  // Skip initialization on server
  if (typeof window === 'undefined') {
    return { app: undefined };
  }
  
  // Return existing instance if already initialized
  if (firebaseApp) {
    return { app: firebaseApp };
  }
  
  // Return existing initialization promise if in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Return error if previous init failed
  if (initializationError) {
    return { app: undefined };
  }
  
  isInitializing = true;
  
  // Create and cache initialization promise
  initializationPromise = new Promise(async (resolve) => {
    try {
      // Safely initialize Firebase app
      firebaseApp = safelyGetFirebaseApp();
      
      if (!firebaseApp) {
        throw new Error('Failed to initialize Firebase app');
      }
      
      // Set up performance monitoring if available in production
      if (process.env.NODE_ENV === 'production') {
        try {
          const { getPerformance } = await import('firebase/performance');
          getPerformance(firebaseApp);
        } catch (perfError) {
          // Silently fail if performance monitoring isn't available
        }
      }
      
      // Connect to emulators in development if configured
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
        try {
          // These will be connected only when the services are first accessed
          const auth = getAuth(firebaseApp);
          const db = getFirestore(firebaseApp);
          const storage = getStorage(firebaseApp);
          
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
        } catch (error) {
          // Silently fail if emulator connection fails
        }
      }
      
      isInitializing = false;
      resolve({ app: firebaseApp });
    } catch (error) {
      initializationError = error instanceof Error ? error : new Error(String(error));
      isInitializing = false;
      resolve({ app: undefined });
    }
  });
  
  return initializationPromise;
};

// Type guard for promise
const isPromise = <T>(value: any): value is Promise<T> => {
  return !!value && typeof value.then === 'function';
};

// Synchronously get app when possible, return undefined otherwise
const getFirebaseAppSync = (): FirebaseApp | undefined => {
  // Skip on server
  if (typeof window === 'undefined') return undefined;
  
  // Return existing instance if already initialized
  if (firebaseApp) return firebaseApp;
  
  // If initialization is in progress or has failed, return undefined
  if (isInitializing || initializationError) return undefined;
  
  // Try to initialize synchronously
  try {
    firebaseApp = safelyGetFirebaseApp();
    return firebaseApp;
  } catch (error) {
    return undefined;
  }
};

// Lazy getter for Auth - only initialize when actually needed
export const auth = {
  get instance() {
    if (authInstance) return authInstance;
    
    // Try to get app synchronously
    const app = getFirebaseAppSync();
    if (app) {
      try {
        authInstance = getAuth(app);
        if (typeof window !== 'undefined') {
          authInstance.languageCode = navigator.language || 'en';
        }
        return authInstance;
      } catch (error) {
        return undefined;
      }
    }
    
    // Start async initialization if not already started
    if (!initializationPromise) {
      initializeFirebaseInternal();
    }
    
    return undefined;
  }
};

// Lazy getter for Firestore
export const db = {
  get instance() {
    if (dbInstance) return dbInstance;
    
    // Try to get app synchronously
    const app = getFirebaseAppSync();
    if (app) {
      try {
        dbInstance = getFirestore(app);
        return dbInstance;
      } catch (error) {
        return undefined;
      }
    }
    
    // Start async initialization if not already started
    if (!initializationPromise) {
      initializeFirebaseInternal();
    }
    
    return undefined;
  }
};

// Lazy getter for Storage
export const storage = {
  get instance() {
    if (storageInstance) return storageInstance;
    
    // Try to get app synchronously
    const app = getFirebaseAppSync();
    if (app) {
      try {
        storageInstance = getStorage(app);
        return storageInstance;
      } catch (error) {
        return undefined;
      }
    }
    
    // Start async initialization if not already started
    if (!initializationPromise) {
      initializeFirebaseInternal();
    }
    
    return undefined;
  }
};

// Public initialization function - will either return synchronously or start async initialization
export const initializeFirebase = () => {
  const result = initializeFirebaseInternal();
  
  if (isPromise(result)) {
    // If initialization is async, start it but return empty object
    result.then(({ app }) => {
      // Initialize auth, db, and storage instances if app is available
      if (app) {
        authInstance = authInstance || getAuth(app);
        dbInstance = dbInstance || getFirestore(app);
        storageInstance = storageInstance || getStorage(app);
      }
    }).catch(() => {
      // Silently handle errors - they are already stored in initializationError
    });
    
    return { 
      app: undefined, 
      auth: undefined, 
      db: undefined, 
      storage: undefined 
    };
  }
  
  // If initialization is sync, return initialized values
  return { 
    app: result.app, 
    auth: result.app ? auth.instance : undefined, 
    db: result.app ? db.instance : undefined, 
    storage: result.app ? storage.instance : undefined 
  };
};

// Trigger initialization in client
if (typeof window !== 'undefined') {
  initializeFirebaseInternal();
}
