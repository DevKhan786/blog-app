"use client";
import { Button } from "@/components/ui/button";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDeleteUser = async (userId: string, userEmail?: string) => {
    if (userId === currentUser?.uid) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      toast.error("Cannot delete admin account");
      return;
    }

    if (!confirm("Permanently delete this user and all their posts?")) return;

    try {
      setDeletingId(userId);

      const postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", userId)
      );
      const postsSnapshot = await getDocs(postsQuery);

      const deletePromises = postsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "users", userId));

      setAuthors(authors.filter((author) => author.uid !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Manage Users
        </h1>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 sm:p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <p className="text-gray-400">Loading authors...</p>
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-8 sm:py-16 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-3">
            No authors found
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {authors.map((author) => (
            <div
              key={author.uid}
              className="bg-zinc-900/50 rounded-lg border border-zinc-800 p-4 sm:p-5 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {author.photoURL ? (
                    <img
                      src={author.photoURL}
                      alt={author.displayName}
                      className="w-10 h-10 rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">
                        {author.displayName}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 truncate">
                        {author.email}
                      </p>
                    </div>
                    {author.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(author.uid, author.email)}
                      disabled={
                        deletingId === author.uid ||
                        author.uid === currentUser?.uid ||
                        author.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
                      }
                      className="cursor-pointer text-xs h-8 px-3"
                    >
                      {deletingId === author.uid ? (
                        "Deleting..."
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 mr-1.5" />
                          Delete
                        </>
                      )}
                    </Button>

                    <span className="text-xs text-zinc-500">
                      {author.postCount || 0} posts
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
