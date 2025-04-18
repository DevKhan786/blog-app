"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase/firebase";
import { UserProfileWithPostCount } from "../../../../types/types";
import { useAuth } from "../../../../lib/contexts/AuthContext";
import { toast } from "react-hot-toast";

const AuthorsPage = () => {
  const { user: currentUser } = useAuth();
  const [authors, setAuthors] = useState<UserProfileWithPostCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const postCounts: Record<string, number> = {};

      postsSnapshot.forEach((doc) => {
        const authorId = doc.data().authorId;
        postCounts[authorId] = (postCounts[authorId] || 0) + 1;
      });

      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);

      const authorList = userSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
        postCount: postCounts[doc.id] || 0,
      })) as UserProfileWithPostCount[];

      setAuthors(
        authorList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      setError("Failed to load authors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Manage Users
        </h1>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-400">Loading authors...</p>
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-base font-medium text-gray-300 mb-3">
            No authors found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 p-1">
          {authors.map((author) => (
            <div
              key={author.uid}
              className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-3 sm:p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {author.photoURL ? (
                    <img
                      src={author.photoURL}
                      alt={author.displayName}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {author.displayName}
                      </h3>
                      <p className="md:flex hidden text-xs text-zinc-400 truncate">
                        {author.email}
                      </p>
                    </div>
                    {author.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <span className="text-[10px] sm:text-xs bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled
                              className="h-7 w-full md:max-w-[100px] px-2 sm:px-3 text-xs cursor-not-allowed opacity-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1 sm:mr-1.5" />
                              <span className="sm:inline">Delete</span>
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="border-zinc-700 bg-zinc-800"
                        >
                          <p className="text-xs text-zinc-200">
                            Delete disabled in demo
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="md:flex hidden text-xs text-zinc-500 whitespace-nowrap">
                      {author.postCount} post{author.postCount !== 1 && "s"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorsPage;
