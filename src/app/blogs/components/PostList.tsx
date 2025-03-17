"use client";

import React from "react";
import PostItem from "./PostItem";
import { Loader2 } from "lucide-react";
import { Posts } from "../../../../types/types";

interface PostListProps {
  posts: Posts[];
  isLoading: boolean;
  error: string | null;
  onDelete: (postId: string) => Promise<void>;
  deletingId: string | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  error,
  onDelete,
  deletingId,
}) => {
  if (posts.length === 0 && !isLoading && !error) {
    return (
      <div className="w-full p-2 sm:p-4 text-center border border-zinc-800 rounded-lg bg-zinc-900/50">
        <p className="text-zinc-400 text-xs sm:text-sm">
          No posts yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onDelete={onDelete}
          isDeleting={deletingId === post.id}
        />
      ))}

      {isLoading && (
        <div className="flex justify-center pt-3">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-indigo-500" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 text-xs sm:text-sm p-1.5">
          {error}
        </div>
      )}
    </div>
  );
};

export default PostList;
