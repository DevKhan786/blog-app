"use client";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db, provider } from "../firebase/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  handleSignInWithGoogle: () => Promise<void>;
  handleEmailPasswordAuth: (
    email: string,
    password: string,
    isSignup?: boolean
  ) => Promise<void>;
  handleResetPassword: (email: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 200);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        await createUserProfile(currentUser);
      }
      setUser(currentUser || null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      router.push("/");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        provider: user.providerData[0]?.providerId || "password",
        favoritePostIds: [],
        updatedAt: new Date().toISOString(),
      });
    } else {
      const updates: any = {
        email: user.email,
        displayName: user.displayName || userSnapshot.data().displayName,
        photoURL: user.photoURL || userSnapshot.data().photoURL,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!userSnapshot.data().favoritePostIds) {
        updates.favoritePostIds = [];
      }

      await updateDoc(userRef, updates);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Logout failed");
    }
    setLoading(false);
  };

  const handleEmailPasswordAuth = async (
    email: string,
    password: string,
    isSignup: boolean = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      if (
        isSignup &&
        email.toLowerCase() ===
          process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()
      ) {
        setError("This email is reserved. Please use a different email.");
        setLoading(false);
        return;
      }

      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await createUserProfile(userCredential.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage = isSignup
        ? "Signup failed. Please try again."
        : "Login failed. Please check your credentials.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      if (
        email.toLowerCase() ===
        process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase()
      ) {
        setError("Password reset is disabled for the demo admin account.");
        setLoading(false);
        return Promise.reject(new Error("Admin password reset not allowed"));
      }

      await sendPasswordResetEmail(auth, email);
      return Promise.resolve();
    } catch (error: unknown) {
      const errorMessage = "Failed to send password reset email.";
      setError(errorMessage);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || !minDelayPassed,
        error,
        handleSignInWithGoogle,
        handleEmailPasswordAuth,
        handleResetPassword,
        handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
