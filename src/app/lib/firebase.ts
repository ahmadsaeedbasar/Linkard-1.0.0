import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "linkard-freelancer-hub",
  appId: "1:760868999991:web:411b5882cac5539a40c0b2",
  storageBucket: "linkard-freelancer-hub.firebasestorage.app",
  apiKey: "AIzaSyAU5PW1dytY9NcQnO9KThdiDNLPlhBRcTQ",
  authDomain: "linkard-freelancer-hub.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "760868999991"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

// Initialize Firestore with offline persistence
let db: Firestore;
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(app, {});
    enableIndexedDbPersistence(db);
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
        if ((error as { code: string }).code == 'failed-precondition') {
            console.warn('Firestore persistence failed: Multiple tabs open. Falling back to memory-only persistence.');
        } else if ((error as { code: string }).code == 'unimplemented') {
            console.warn('Firestore persistence failed: Browser does not support it. Falling back to memory-only persistence.');
        }
    }
    // Initialize without persistence on failure
    db = getFirestore(app);
  }
} else {
    // For server-side rendering
    db = getFirestore(app);
}


export { app, auth, db };
