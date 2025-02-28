import { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  profilePic: { uri: string };
  ciiScore: number;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('No user logged in');
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            name: userData.displayName || 'User',
            email: user.email || '',
            profilePic: { uri: userData.profilePic || 'https://randomuser.me/api/portraits/men/32.jpg' },
            ciiScore: userData.ciiScore || 0
          });
        } else {
          setError('User profile not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
