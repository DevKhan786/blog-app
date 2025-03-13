"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const {
    user,
    loading,
    error,
    handleSignInWithGoogle,
    handleEmailPasswordAuth,
    handleResetPassword,
    clearError,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!showResetPassword) {
      if (!password) {
        errors.password = "Password is required";
      } else if (isNewUser && password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    if (showResetPassword) {
      try {
        await handleResetPassword(email);
        setResetSent(true);
      } catch (error) {
        
      }
    } else {
      await handleEmailPasswordAuth(email, password, isNewUser);
    }
  };

  const toggleAuthMode = () => {
    clearError();
    setValidationErrors({});
    setIsNewUser(!isNewUser);
    setShowResetPassword(false);
    setResetSent(false);
  };

  const toggleResetPassword = () => {
    clearError();
    setValidationErrors({});
    setShowResetPassword(!showResetPassword);
    setResetSent(false);
  };

  const handleGoogleSignIn = async () => {
    clearError();
    await handleSignInWithGoogle();
  };

  return (
    <div className="border border-black w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center">
        {showResetPassword
          ? "Reset Password"
          : isNewUser
          ? "Create Account"
          : "Welcome Back"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {resetSent && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="text-sm text-center">
            Password reset email sent! Check your inbox.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={validationErrors.email ? "border-red-500" : ""}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs">{validationErrors.email}</p>
          )}
        </div>

        {!showResetPassword && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={validationErrors.password ? "border-red-500" : ""}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs">
                {validationErrors.password}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full capitalize cursor-pointer"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : showResetPassword
            ? "Send Reset Link"
            : isNewUser
            ? "Sign Up"
            : "Sign In"}
        </Button>

        <div className="flex justify-between text-sm">
          {!showResetPassword && !isNewUser && (
            <button
              type="button"
              onClick={toggleResetPassword}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          )}

          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-600 hover:underline ml-auto cursor-pointer"
          >
            {isNewUser
              ? "Already have an account? Sign In"
              : "Need an account? Sign Up"}
          </button>
        </div>

        {showResetPassword && (
          <button
            type="button"
            onClick={toggleResetPassword}
            className="text-blue-600 hover:underline w-full text-center cursor-pointer"
          >
            Return to sign in
          </button>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          disabled={loading}
        >
          <FcGoogle className="w-5 h-5" />
          Google
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
