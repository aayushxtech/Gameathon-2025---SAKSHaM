import { Timestamp } from "firebase/firestore";

export interface UserPreferences {
  notifications: boolean;
  darkMode: boolean;
}

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  role: "user" | "admin";
  phoneNumber: string | null;
  photoURL: string | null;
  preferences: UserPreferences;
  favorites: string[];
  completed: string[];
}
