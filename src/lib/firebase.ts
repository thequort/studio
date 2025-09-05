import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-1611607096-93b93",
  "appId": "1:1048810017794:web:3092737a5f64ca07c5031b",
  "storageBucket": "studio-1611607096-93b93.firebasestorage.app",
  "apiKey": "AIzaSyBJMmjEmZqyohg2LFVWCyuPvuA2mjMk86o",
  "authDomain": "studio-1611607096-93b93.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1048810017794"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
