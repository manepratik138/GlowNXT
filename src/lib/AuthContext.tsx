"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { seedFirestoreData } from "./dbSeeder";
import { localDb } from "./localStore";
import { localAuthService } from "./localAuthService";

export type UserRole = "customer" | "professional" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  city?: string;
  createdAt?: string;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  services: string[];
  price: number;
  available: boolean;
  bio: string;
  completedJobs: number;
  specializations?: string[];
  certificates?: string[];
  portfolio?: string[];
  availableSlots?: string[];
  priceList?: { service: string; price: number }[];
  verificationStatus?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  proProfile: ProfessionalProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  proProfile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ─── Helpers ───────────────────────────────────────────────
/** Load profiles from Firestore (Firebase mode) */
async function fetchFirebaseProfiles(
  currentUser: FirebaseUser,
  setUserProfile: (p: UserProfile | null) => void,
  setProProfile: (p: ProfessionalProfile | null) => void
) {
  if (!db) return;
  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const profile = userDoc.data() as UserProfile;
      setUserProfile(profile);
      if (profile.role === "professional") {
        const proDocRef = doc(db, "professionals", currentUser.uid);
        const proDoc = await getDoc(proDocRef);
        setProProfile(proDoc.exists() ? (proDoc.data() as ProfessionalProfile) : null);
      } else {
        setProProfile(null);
      }
    } else {
      setUserProfile(null);
      setProProfile(null);
    }
  } catch (err) {
    console.error("Error fetching Firebase user profile:", err);
  }
}

/** Load profiles from localStorage (local mode) */
function loadLocalProfiles(
  uid: string,
  setUserProfile: (p: UserProfile | null) => void,
  setProProfile: (p: ProfessionalProfile | null) => void
) {
  const userDoc = localDb.getDoc("users", uid);
  if (userDoc.exists()) {
    const profile = userDoc.data() as unknown as UserProfile;
    setUserProfile(profile);
    if (profile.role === "professional") {
      const proDoc = localDb.getDoc("professionals", uid);
      setProProfile(proDoc.exists() ? ((proDoc.data() as unknown) as ProfessionalProfile) : null);
    } else {
      setProProfile(null);
    }
  } else {
    setUserProfile(null);
    setProProfile(null);
  }
}

// ─── Provider ──────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [proProfile, setProProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth) {
      // Local mode
      const session = localAuthService.getCurrentSession();
      if (session) loadLocalProfiles(session.uid, setUserProfile, setProProfile);
      return;
    }
    // Firebase mode
    if (user) await fetchFirebaseProfiles(user, setUserProfile, setProProfile);
  };

  useEffect(() => {
    if (!auth) {
      // ── LOCAL MODE ──────────────────────────────────────
      const session = localAuthService.getCurrentSession();
      if (session) {
        // Create a minimal user-like object that satisfies FirebaseUser shape
        setUser({ uid: session.uid, email: session.email } as FirebaseUser);
        loadLocalProfiles(session.uid, setUserProfile, setProProfile);
      }
      setLoading(false);
      return; // no cleanup needed
    }

    // ── FIREBASE MODE ────────────────────────────────────
    seedFirestoreData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchFirebaseProfiles(currentUser, setUserProfile, setProProfile);
      } else {
        setUserProfile(null);
        setProProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth) {
      // Local mode logout
      localAuthService.signOut();
      setUser(null);
      setUserProfile(null);
      setProProfile(null);
      setLoading(false);
      window.location.href = "/";
      return;
    }
    // Firebase logout
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setProProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, proProfile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
