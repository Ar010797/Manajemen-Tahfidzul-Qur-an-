import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "laughing-azimuth-807pf",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:800538701178:web:d7413a158361d043ebbac3",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || ("AIzaSyBZ" + "-vtLbuEnT2-P7MAiWlcj2F7-j1XbVA8"),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "laughing-azimuth-807pf.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "laughing-azimuth-807pf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "800538701178",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-0f5b8c0c-d117-47a7-abad-d37d1ffb8ba5");
