import { initializeApp, getApps, getApp } from 'firebase/app';
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

// Check if all required Firebase config values are present
const isFirebaseConfigValid = () => {
  const isValid = (
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId &&
    !!firebaseConfig.storageBucket &&
    !!firebaseConfig.messagingSenderId &&
    !!firebaseConfig.appId
  );
  
  if (!isValid) {
    console.error("Firebase configuration is incomplete. Check your environment variables.");
    // Log which specific values are missing
    if (!firebaseConfig.apiKey) console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!firebaseConfig.authDomain) console.error("Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!firebaseConfig.projectId) console.error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!firebaseConfig.storageBucket) console.error("Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!firebaseConfig.messagingSenderId) console.error("Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!firebaseConfig.appId) console.error("Missing NEXT_PUBLIC_FIREBASE_APP_ID");
  }
  
  return isValid;
};

// Initialize Firebase
let app;
// Initialize with empty objects that will be replaced if on client side
let auth: Auth = {} as Auth;
let db: Firestore = {} as Firestore;
let storage: FirebaseStorage = {} as FirebaseStorage;

// Check if we're running on the client side
if (typeof window !== 'undefined') {
  try {
    if (!isFirebaseConfigValid()) {
      console.error("Firebase initialization failed due to invalid configuration.");
    } else {
      // Initialize Firebase
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
      } else {
        app = getApp();
        console.log("Using existing Firebase app");
      }

      // Initialize services
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);

      // Set auth language to match browser
      try {
        auth.languageCode = window.navigator.language || 'en';
        console.log(`Auth language set to: ${auth.languageCode}`);
      } catch (error) {
        console.warn("Could not set auth language:", error);
      }

      // Connect to emulators in development if needed
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectStorageEmulator(storage, 'localhost', 9199);
          console.log('Connected to Firebase emulators');
        } catch (error) {
          console.error('Error connecting to Firebase emulators:', error);
        }
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
} else {
  console.log("Firebase not initialized on server side - this is expected behavior");
}

export { app, auth, db, storage };