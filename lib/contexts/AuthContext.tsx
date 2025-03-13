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
import { auth, provider } from "../firebase";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
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
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: unknown) {
      // Simple generic error message based on the auth action
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
        loading,
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
