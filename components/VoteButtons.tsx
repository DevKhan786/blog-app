"use client";
import React from "react";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLikesAndFavorites } from "../lib/hooks/useLikesAndFavorites";

interface VoteButtonsProps {
  postId: string;
  className?: string;
  showFavorite?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  postId,
  className = "",
  showFavorite = true,
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
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLike}
        disabled={isProcessing}
        className={`cursor-pointer h-6 w-6 p-0 xs:h-7 xs:w-7 ${
          isLiked
            ? "text-green-500 bg-green-500/10"
            : "text-zinc-400 hover:bg-zinc-800"
        } transition-colors duration-300`}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <ThumbsUp
          className={`h-3 w-3 xs:h-4 xs:w-4 ${isLiked ? "fill-green-500" : ""}`}
        />
      </Button>

      <span
        className={`text-[0.7rem] xs:text-xs font-medium min-w-[16px] xs:min-w-[20px] text-center ${
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
        className={`cursor-pointer h-6 w-6 p-0 xs:h-7 xs:w-7 ${
          isDisliked
            ? "text-red-500 bg-red-500/10"
            : "text-zinc-400 hover:bg-zinc-800"
        } transition-colors duration-300`}
        aria-label={isDisliked ? "Remove dislike" : "Dislike"}
      >
        <ThumbsDown
          className={`h-3 w-3 xs:h-4 xs:w-4 ${
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
          className={`cursor-pointer h-6 w-6 p-0 xs:h-7 xs:w-7 ${
            isFavorited
              ? "text-indigo-500 bg-indigo-500/10"
              : "text-zinc-400 hover:bg-zinc-800"
          } transition-colors duration-300`}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Bookmark
            className={`h-3 w-3 xs:h-4 xs:w-4 ${
              isFavorited ? "fill-indigo-500" : ""
            }`}
          />
        </Button>
      )}
    </div>
  );
};

export default VoteButtons;
