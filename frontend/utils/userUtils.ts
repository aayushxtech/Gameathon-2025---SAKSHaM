import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/firebaseConfig";
import { UserData } from "@/types/user";

/**
 * Get user data from Firestore
 * @param userId The user ID
 * @returns The user data or null if not found
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

/**
 * Create a new user document in Firestore
 * @param userData The user data to create
 * @returns True if successful, false otherwise
 */
export const createUserDocument = async (userData: Partial<UserData> & { uid: string }): Promise<boolean> => {
  try {
    const userDocRef = doc(firestore, "users", userData.uid);
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error creating user document:", error);
    return false;
  }
};

/**
 * Update an existing user document in Firestore
 * @param userId The user ID
 * @param userData The user data to update
 * @returns True if successful, false otherwise
 */
export const updateUserDocument = async (userId: string, userData: Partial<UserData>): Promise<boolean> => {
  try {
    const userDocRef = doc(firestore, "users", userId);
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error updating user document:", error);
    return false;
  }
};
