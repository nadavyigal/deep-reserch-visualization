import { NextResponse } from 'next/server';

export async function GET() {
  // Check for Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Safely redact API keys when returning
  const safeConfig = {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 8)}...` : null,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId ? 'present' : null,
    appId: firebaseConfig.appId ? 'present' : null,
  };

  // Determine environment
  const environment = process.env.NODE_ENV || 'unknown';

  // Validate configuration
  const requiredFields = ['apiKey', 'authDomain', 'projectId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  const isValid = missingFields.length === 0;

  return NextResponse.json({
    status: isValid ? 'ok' : 'error',
    environment,
    configStatus: isValid ? 'valid' : 'invalid',
    missingFields: missingFields.length > 0 ? missingFields : null,
    config: safeConfig,
    timestamp: new Date().toISOString(),
  });
} 