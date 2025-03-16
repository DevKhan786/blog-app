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
      } catch (error) {}
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

  const fillAdminCredentials = () => {
    setEmail("test123@gmail.com");
    setPassword("test123");
    setIsNewUser(false);
    setShowResetPassword(false);
  };

  return (
    <div className="mx-auto w-[90%] sm:w-[85%] md:w-[70%] lg:max-w-md p-3 sm:p-5 space-y-3 sm:space-y-5 bg-white rounded-lg shadow-md border border-black">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
        {showResetPassword
          ? "Reset Password"
          : isNewUser
          ? "Create Account"
          : "Welcome Back"}
      </h2>

      {error && (
        <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>
      )}

      {resetSent && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-2 py-2 rounded">
          <p className="text-xs sm:text-sm text-center">
            Password reset email sent! Check your inbox.
          </p>
        </div>
      )}

      {/* Admin Credentials Box */}
      <div className="p-3 bg-gray-100 border border-dashed border-gray-400 rounded-md">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Admin Test Credentials:
        </h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <span className="font-medium">Email:</span>
          <span className="font-mono break-all">test123@gmail.com</span>
          <span className="font-medium">Password:</span>
          <span className="font-mono">test123</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Use these to access admin features
          </p>
          <Button
            type="button"
            size="sm"
            className="h-6 text-xs px-2 py-0 hoverEffect"
            onClick={fillAdminCredentials}
          >
            Auto-fill
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={`text-sm h-8 sm:h-9 ${
              validationErrors.email ? "border-red-500" : ""
            }`}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs">{validationErrors.email}</p>
          )}
        </div>

        {!showResetPassword && (
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`text-sm h-8 sm:h-9 ${
                validationErrors.password ? "border-red-500" : ""
              }`}
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
          className="w-full capitalize cursor-pointer h-8 sm:h-9 text-sm"
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

        <div className="flex flex-col text-xs gap-2">
          {!showResetPassword && !isNewUser && (
            <button
              type="button"
              onClick={toggleResetPassword}
              className="text-blue-600 hover:underline cursor-pointer text-xs"
            >
              Forgot password?
            </button>
          )}

          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-600 hover:underline cursor-pointer text-xs"
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
            className="text-blue-600 hover:underline w-full text-center cursor-pointer text-xs"
          >
            Return to sign in
          </button>
        )}

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-gray-500 text-xs">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 cursor-pointer h-8 sm:h-9 text-xs sm:text-sm"
          disabled={loading}
        >
          <FcGoogle className="w-4 h-4" />
          Google
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
