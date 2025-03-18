"use client";

import React, { useEffect, useState } from "react";
import { CategoryWithId } from "../../../../types/types";
import TextEditor from "../../../../components/rich-text-editor";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../lib/contexts/AuthContext";
import { useUserProfile } from "../../../../lib/hooks/useUserProfile";

interface PostFormProps {
  categories: CategoryWithId[];
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  postContent: {
    title: string;
    description: string;
    categoryId: string;
    imagePublicId: string;
  };
  setPostContent: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      categoryId: string;
      imagePublicId: string;
    }>
  >;
  titleMaxLength: number;
  descriptionMaxLength: number;
}

const PostForm: React.FC<PostFormProps> = ({
  categories,
  isSubmitting,
  handleSubmit,
  postContent,
  setPostContent,
  titleMaxLength,
  descriptionMaxLength,
}) => {
  const [titleCharsLeft, setTitleCharsLeft] = useState(titleMaxLength);
  const { user, loading: authLoading } = useAuth();
  const [isDisabled, setIsDisabled] = useState(true);
  const { profile, loading: profileLoading } = useUserProfile(user);

  useEffect(() => {
    setIsDisabled(authLoading || !user);
  }, [user, authLoading]);

  const handleAuthenticatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create posts");
      return;
    }
    await handleSubmit(e);
  };

  useEffect(() => {
    setTitleCharsLeft(titleMaxLength - postContent.title.length);
  }, [postContent.title, titleMaxLength]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-white text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleAuthenticatedSubmit}
      className="bg-black rounded-lg shadow-lg relative"
    >
      {isDisabled && (
        <div className="absolute inset-0 bg-zinc-900/80 z-10 flex items-center justify-center rounded-lg">
          <p className="text-red-500 font-medium text-sm sm:text-base uppercase">
            {authLoading
              ? "Checking authentication..."
              : "Please login to create posts"}
          </p>
        </div>
      )}

      <div
        className={`space-y-1.5 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="relative">
          <input
            id="title"
            type="text"
            placeholder="Post title"
            value={postContent.title}
            onChange={(e) =>
              !isDisabled &&
              setPostContent((prev) => ({ ...prev, title: e.target.value }))
            }
            maxLength={titleMaxLength}
            className="w-full text-base sm:text-xl py-1 px-2 border rounded-lg bg-black border-b border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            required
            disabled={isDisabled}
          />
          <div
            className={`text-[0.6rem] sm:text-xs absolute right-2 bottom-1 ${
              titleCharsLeft < 10
                ? "text-red-400"
                : titleCharsLeft < 20
                ? "text-green-500"
                : "text-zinc-500"
            }`}
          >
            {titleCharsLeft}
          </div>
        </div>

        <div>
          <select
            id="category"
            value={postContent.categoryId}
            onChange={(e) =>
              !isDisabled &&
              setPostContent((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            className="w-full p-1.5 sm:p-2 text-xs sm:text-sm rounded-md bg-black border border-zinc-700 text-zinc-300 focus:outline-none focus:border-indigo-500"
            required
            disabled={isDisabled}
          >
            <option value="" disabled className="bg-zinc-800 text-xs">
              Select category
            </option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="bg-zinc-900 text-zinc-300 text-xs sm:text-sm"
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <TextEditor
            value={postContent.description}
            handleSubmit={handleAuthenticatedSubmit}
            isSubmitting={isSubmitting}
            maxLength={descriptionMaxLength}
            onChange={(html) =>
              !isDisabled &&
              setPostContent((prev) => ({ ...prev, description: html }))
            }
            isDisabled={isDisabled}
          />
        </div>
      </div>
    </form>
  );
};

export default PostForm;
