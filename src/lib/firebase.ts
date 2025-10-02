import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCPsgkDAGLWzYGzM2NXOPgMD1pYR8C3Ug8",
  authDomain: "dagicreative-graphics.firebaseapp.com",
  projectId: "dagicreative-graphics",
  storageBucket: "dagicreative-graphics.firebasestorage.app",
  messagingSenderId: "1046603799963",
  appId: "1:1046603799963:web:119f30a710a563233e153e",
  measurementId: "G-Y0TEBNWC79"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export interface Profile {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  profileImageUrl: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Work {
  id: string;
  title: string;
  category: 'poster_design' | 'thumbnail_design' | 'logo_design' | 'business_card';
  imageUrl: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
  orderIndex: number;
  createdAt: string;
}