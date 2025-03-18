"use client";
import React from "react";
import { User as UserIcon, Trash } from "lucide-react";
import { Posts } from "../../../../types/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../lib/contexts/AuthContext";
import VoteButtons from "../../../../components/VoteButtons";

interface PostItemProps {
  post: Posts;
  onDelete: (postId: string) => Promise<void>;
  isDeleting: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, onDelete, isDeleting }) => {
  const { user } = useAuth();

  return (
    <div className="bg-black rounded-lg border border-zinc-800 p-2 sm:p-3 shadow-lg hover:border-zinc-600 transition-colors">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          {post.authorPhotoURL ? (
            <img
              src={post.authorPhotoURL}
              alt={post.authorName}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  {post.authorName}
                </span>
                <div className="flex items-center gap-1 text-zinc-400">
                  <span className="text-[0.65rem] sm:text-xs">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-zinc-600 text-xs">•</span>
                  <span className="text-[0.65rem] sm:text-xs text-indigo-400 truncate">
                    {post.categoryName}
                  </span>
                </div>
              </div>
              <h2 className="text-xs sm:text-sm font-medium text-white truncate mt-0.5">
                {post.title}
              </h2>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <VoteButtons postId={post.id} className="scale-90 sm:scale-100" />
              {user?.uid === post.authorId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(post.id)}
                  disabled={isDeleting}
                  className="h-6 w-6 p-0 xs:h-7 xs:w-7 text-zinc-400 hover:bg-zinc-800 hover:text-red-500 transition-colors duration-300"
                >
                  <Trash className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                  <span className="sr-only">Delete post</span>
                </Button>
              )}
            </div>
          </div>

          <div
            className="prose prose-invert max-w-none text-zinc-300 text-xs mt-1 sm:mt-2"
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
