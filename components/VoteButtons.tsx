"use client";
import React from "react";
import { ThumbsUp, ThumbsDown, Bookmark, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLikesAndFavorites } from "../lib/hooks/useLikesAndFavorites";
import { User } from "firebase/auth";
import { Posts } from "../types/types";

interface VoteButtonsProps {
  postId: string;
  className?: string;
  showFavorite?: boolean;
  user?: User | null;
  post: Posts;
  isDeleting?: boolean;
  onDelete?: (postId: string) => Promise<void>;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  postId,
  className = "",
  showFavorite = true,
  user,
  post,
  isDeleting,
  onDelete,
}) => {
  const {
    isLiked,
    isDisliked,
    isFavorited,
    likeCount,
    isProcessing,
    toggleLike,
    toggleDislike,
    toggleFavorite,
  } = useLikesAndFavorites(postId);

  return (
    <div className={`flex items-center gap-0 sm:gap-1 ${className}`}>
      <div className="flex items-center gap-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          disabled={isProcessing}
          className={`h-5 w-5 p-0 sm:h-6 sm:w-6 cursor-pointer ${
            isLiked
              ? "text-green-500 bg-green-500/10"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <ThumbsUp
            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
              isLiked ? "fill-green-500" : ""
            }`}
          />
        </Button>
      </div>

      <span
        className={`text-sm min-w-[15px] text-center ${
          likeCount > 0
            ? "text-green-500"
            : likeCount < 0
            ? "text-red-500"
            : "text-zinc-400"
        }`}
      >
        {likeCount}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDislike}
        disabled={isProcessing}
        className={`h-5 w-5 p-0 sm:h-6 sm:w-6 cursor-pointer ${
          isDisliked
            ? "text-red-500 bg-red-500/10"
            : "text-zinc-400 hover:bg-zinc-800"
        }`}
      >
        <ThumbsDown
          className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
            isDisliked ? "fill-red-500" : ""
          }`}
        />
      </Button>

      {showFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFavorite}
          disabled={isProcessing}
          className={`h-5 w-5 p-0 sm:h-6 sm:w-6 cursor-pointer ${
            isFavorited
              ? "text-indigo-500 bg-indigo-500/10"
              : "text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <Bookmark
            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
              isFavorited ? "fill-indigo-500" : ""
            }`}
          />
        </Button>
      )}

      {user?.uid === post.authorId && onDelete && post && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(post.id)}
          disabled={isDeleting}
          className="h-5 w-5 p-0 sm:h-6 sm:w-6 cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-red-500"
        >
          <Trash className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        </Button>
      )}
    </div>
  );
};

export default VoteButtons;
