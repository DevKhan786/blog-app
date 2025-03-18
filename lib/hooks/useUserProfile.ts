"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { User } from "firebase/auth";
import { UserProfile } from "../../types/types";

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();

        const userProfile: UserProfile = {
          uid: doc.id,
          displayName:
            data.displayName ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "User",
          email: data.email || user.email || "",
          photoURL: data.photoURL || user.photoURL || null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          favoritePostIds: data.favoritePostIds || [],
        };

        setProfile(userProfile);
      } else {
        setProfile({
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favoritePostIds: [],
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { profile, loading };
};
