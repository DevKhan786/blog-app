"use client";

import React from "react";
import { User as UserIcon, Trash } from "lucide-react";
import { Posts } from "../../../../types/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../lib/contexts/AuthContext";

interface PostItemProps {
  post: Posts;
  onDelete: (postId: string) => Promise<void>;
  isDeleting: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete, isDeleting }) => {
  const { user } = useAuth();

  return (
    <div className="bg-black rounded-lg border border-zinc-800 p-3 sm:p-4 shadow-lg hover:border-zinc-600 transition-colors">
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {post.authorPhotoURL ? (
            <img
              src={post.authorPhotoURL}
              alt={post.authorName}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm">
                <span className="font-semibold text-white truncate">
                  {post.authorName}
                </span>
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="text-zinc-400 whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-indigo-400 truncate">
                  {post.categoryName}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white break-words">
                {post.title}
              </h2>
            </div>

            {user?.uid === post.authorId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                disabled={isDeleting}
                className="text-zinc-400 cursor-pointer hover:bg-zinc-800 hover:text-red-500 h-7 w-7 p-1.5"
              >
                <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="sr-only">Delete post</span>
              </Button>
            )}
          </div>

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
  );
};

export default PostItem;
