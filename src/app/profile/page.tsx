"use client";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "lucide-react";
import { auth, db } from "../../../lib/firebase/firebase";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { useUserProfile } from "../../../lib/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user);
  const [displayName, setDisplayName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (profile) setDisplayName(profile.displayName || "");
  }, [user, router, profile]);

  const validateDisplayName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "Name cannot be empty";
    if (trimmed.length > 10) return "Name must be 10 characters or less";
    if (/[^a-zA-Z0-9 _-]/.test(trimmed)) return "Invalid characters used";
    return null;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const validationError = validateDisplayName(displayName);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const newName = displayName.trim();
    if (newName === profile.displayName) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    setUpdateLoading(true);
    try {
      await Promise.all([
        updateDoc(doc(db, "users", user.uid), { displayName: newName }),
        updateProfile(auth.currentUser!, { displayName: newName }),
      ]);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.uid);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { imageUrl } = await response.json();

      await Promise.all([
        updateDoc(doc(db, "users", user.uid), { photoURL: imageUrl }),
        updateProfile(auth.currentUser!, { photoURL: imageUrl }),
      ]);
      toast.success("Profile image updated!");
      setInputKey(Date.now());
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (profileLoading || !profile) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="rounded-full bg-zinc-800 w-32 h-32" />
          <div className="h-8 bg-zinc-800 rounded w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mt-4 mb-8">
        Profile Settings
      </h1>

      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-zinc-900 border-2 border-indigo-600 overflow-hidden">
            {profile.photoURL ? (
              <Image
                src={profile.photoURL}
                alt="Profile"
                width={128}
                height={128}
                className="object-contain w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-900">
                <User className="w-16 h-16 text-indigo-400" />
              </div>
            )}
          </div>
          <input
            key={inputKey}
            type="file"
            id="avatar-upload"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            disabled={uploading}
          />
          <Button
            variant="outline"
            className="cursor-pointer absolute bottom-0 right-0 rounded-full p-2 h-10 w-10"
            onClick={() => document.getElementById("avatar-upload")?.click()}
            disabled={uploading}
            aria-label="Change profile picture"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "✎"}
          </Button>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="w-full max-w-md space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              placeholder="Enter display name (max 10 chars)"
              maxLength={10}
              aria-describedby="name-help"
            />
            <p id="name-help" className="text-xs text-zinc-500">
              Allowed characters: letters, numbers, spaces, underscores, hyphens
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={updateLoading || !displayName.trim()}
            aria-label="Update profile"
          >
            {updateLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
