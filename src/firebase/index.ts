'use client';

import { firebaseConfig as localFirebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

const getFirebaseConfig = (): FirebaseOptions => {
  const serverConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // If the essential environment variables are present, use them.
  if (serverConfig.apiKey && serverConfig.projectId) {
    return serverConfig;
  }
  
  // Fallback for when environment variables are not set.
  // This is useful for local development without a .env.local file.
  if (localFirebaseConfig.projectId && localFirebaseConfig.apiKey) {
      return localFirebaseConfig;
  }

  // If no config is found, throw an error.
  throw new Error("Firebase config is missing. Please set up your environment variables or firebase/config.ts file.");
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    const firebaseConfig = getFirebaseConfig();

    // Ensure config is not empty before initializing
    if (!firebaseConfig.projectId) {
        throw new Error("Firebase config is missing. Please set up your environment variables or firebase/config.ts file.");
    }

    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
