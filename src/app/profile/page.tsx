"use client";
import { useEffect, useState } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { auth, db } from "../../../lib/firebase/firebase";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { useUserProfile } from "../../../lib/hooks/useUserProfile";
import { useFavorites } from "../../../lib/hooks/useFavorites";
import { useRouter, useSearchParams } from "next/navigation";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import VoteButtons from "../../../components/VoteButtons";

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user);
  const { favorites, loading: favoritesLoading, error } = useFavorites();
  const [displayName, setDisplayName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "favorites" ? "favorites" : "profile"
  );

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === "favorites") {
      url.searchParams.set("tab", "favorites");
    } else {
      url.searchParams.delete("tab");
    }
    window.history.pushState({}, "", url.toString());
  };

  if (profileLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="rounded-full bg-zinc-800 w-32 h-32" />
          <div className="h-8 bg-zinc-800 rounded w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen   ">
      <div className="flex justify-center mt-20 ">
        <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => handleTabChange("profile")}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleTabChange("favorites")}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              activeTab === "favorites"
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {activeTab === "profile" ? (
        <div className="flex flex-col items-center gap-6 mb-10">
          <h1 className="text-center text-2xl font-bold mt-8 mb-12">
            Profile Settings
          </h1>

          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-zinc-900 border-2 border-indigo-600 overflow-hidden">
              {profile?.photoURL ? (
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
                Allowed characters: letters, numbers, spaces, underscores,
                hyphens
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
      ) : (
        <div className="w-full">
          <h1 className="text-center text-2xl font-bold mt-8 mb-10">
            Your Favorites
          </h1>

          {favoritesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="w-full p-6 text-center border border-zinc-800 rounded-lg bg-zinc-900/50">
              <p className="text-zinc-400 text-sm">
                You haven't added any favorites yet.
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                When you find posts you like, click the bookmark icon to save
                them here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((post) => (
                <div
                  key={post.id}
                  className="bg-black rounded-lg border border-zinc-800 p-3 sm:p-4 shadow-lg hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {post.authorPhotoURL ? (
                        <img
                          src={post.authorPhotoURL}
                          alt={post.authorName}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div className="space-y-1 flex-1 min-w-[200px]">
                          <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm">
                            <span className="font-semibold text-white truncate">
                              {post.authorName}
                            </span>
                            <span className="text-zinc-600 hidden xs:inline">
                              •
                            </span>
                            <span className="text-zinc-400 whitespace-nowrap text-xs">
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                            <span className="text-zinc-600 hidden xs:inline">
                              •
                            </span>
                            <span className="text-indigo-400 truncate text-xs sm:text-sm">
                              {post.categoryName}
                            </span>
                          </div>

                          <h2 className="text-sm sm:text-base font-bold text-white break-words">
                            {post.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-1 ml-auto sm:ml-0">
                          <VoteButtons
                            postId={post.id}
                            className="scale-90 sm:scale-100"
                          />
                        </div>
                      </div>

                      <div className="pl-0 sm:pl-2">
                        <div
                          className="prose prose-invert max-w-none text-zinc-300 text-xs sm:text-sm"
                          dangerouslySetInnerHTML={{ __html: post.description }}
                          style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
