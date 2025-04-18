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
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="bg-black rounded-lg border border-zinc-800 p-1 sm:p-2  shadow-lg hover:border-zinc-600 transition-colors">
      <div className="flex items-start flex-col  p-1">
        <div className="flex w-full bg-neutral-900/90 p-1 sm:px-2 rounded-md">
          <div className="flex-shrink-0 mr-2">
            {post.authorPhotoURL ? (
              <div className="border border-zinc-700 rounded-full p-0.5">
                <img
                  src={post.authorPhotoURL}
                  alt={post.authorName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="border border-zinc-700 rounded-full p-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-between w-full min-w-0">
            <div className="flex flex-col justify-center  w-full -mt-0.5 mr-2 ">
              <span className="text-sm sm:text-base font-semibold text-white truncate">
                {post.authorName || "Anonymous"}
              </span>
              <div className="text-sm text-zinc-400 sm:flex justify-between truncate hidden w-full">
                <h1>{post.title}</h1>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap sm:justify-end  ">
              <VoteButtons
                postId={post.id}
                user={user}
                post={post}
                isDeleting={isDeleting}
                onDelete={onDelete}
              />
              <span className="text-sm hidden sm:flex text-zinc-400 truncate mr-1 ">
                {post.categoryName}
              </span>
            </div>
          </div>
        </div>

        <div className="  w-full">
          <div
            className="prose prose-invert max-w-none bg-neutral-900/90 rounded-sm p-2 text-zinc-300 text-xs mt-1 sm:mt-2"
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
