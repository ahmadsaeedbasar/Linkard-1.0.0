import { doc, setDoc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';

export const createUserProfile = async (user: User, name?: string) => {
  const userRef = doc(db, 'users', user.uid);
  const userProfile: UserProfile = {
    email: user.email || '',
    name: name || user.displayName || '',
  };
  await setDoc(userRef, userProfile);
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const docSnap: DocumentSnapshot<UserProfile> = await getDoc(userRef) as DocumentSnapshot<UserProfile>;

  if (docSnap.exists()) {
    return { ...docSnap.data(), email: docSnap.data()?.email || '' };
  } else {
    return null;
  }
};
