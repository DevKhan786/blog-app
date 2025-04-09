"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { CategoryWithId, Posts } from "../../../types/types";
import { db } from "../../../lib/firebase/firebase";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { useUserProfile } from "../../../lib/hooks/useUserProfile";
import { useRouter, useSearchParams } from "next/navigation";

const TITLE_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 100;

// Parent component handling suspense
export default function BlogsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BlogsContent />
    </Suspense>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
      <p className="text-white text-sm">Loading...</p>
    </div>
  );
}

// Main content component with search params
function BlogsContent() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user);
  const [postContent, setPostContent] = useState({
    title: "",
    description: "",
    categoryId: "",
    imagePublicId: "",
  });
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const categoriesData = await fetchCategories();
        if (isMounted) setCategories(categoriesData);

        const postsRef = collection(db, "posts");
        const unsubscribePosts = onSnapshot(
          postsRef,
          (snapshot) => {
            if (!isMounted) return;

            const postsList = snapshot.docs
              .map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  title: data.title || "",
                  description: data.description || "",
                  categoryId: data.categoryId || "",
                  categoryName: data.categoryName || "",
                  categorySlug: data.categorySlug || "",
                  authorId: data.authorId || "",
                  authorName: data.authorName || "Anonymous",
                  authorEmail: data.authorEmail || null,
                  authorPhotoURL: data.authorPhotoURL || null,
                  createdAt: data.createdAt || new Date().toISOString(),
                  updatedAt: data.updatedAt || new Date().toISOString(),
                  published: data.published || false,
                  imagePublicId: data.imagePublicId || "",
                  likeCount: data.likeCount || 0,
                  likedBy: data.likedBy || [],
                  dislikedBy: data.dislikedBy || [],
                  favoritedBy: data.favoritedBy || [],
                } as Posts;
              })
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );

            const filteredPosts = selectedCategory
              ? postsList.filter(
                  (post) => post.categorySlug === selectedCategory
                )
              : postsList;

            if (isMounted) setPosts(filteredPosts);
          },
          (error) => {
            if (isMounted) {
              setError("Failed to load posts in real-time");
              toast.error("Failed to load posts");
              console.error("Realtime error:", error);
            }
          }
        );

        return () => {
          unsubscribePosts();
          isMounted = false;
        };
      } catch (error) {
        if (isMounted) {
          setError("Failed to load initial data");
          console.error("Initial load error:", error);
        }
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    if (!authLoading) loadData();

    return () => {
      isMounted = false;
    };
  }, [authLoading, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        slug: doc.data().slug || "",
        imageUrl: doc.data().imageUrl || "",
        createdAt: doc.data().createdAt || new Date().toISOString(),
      }));
      return categoryList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      setError("Failed to load categories");
      toast.error("Failed to load categories");
      return [];
    }
  };

  const handleDelete = async (postId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete posts");
      return;
    }

    setDeletingId(postId);
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        toast.error("Post does not exist");
        return;
      }

      const postData = postSnap.data();
      const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      if (postData.authorId !== user.uid && !isAdmin) {
        toast.error("You don't have permission to delete this post");
        return;
      }

      await deleteDoc(postRef);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isDescriptionEmpty = () => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = postContent.description;
      return (tempDiv.textContent?.trim() || "") === "";
    };

    if (!user || !profile) {
      toast.error("You must be logged in to create a post");
      return;
    }

    if (
      !postContent.title.trim() ||
      isDescriptionEmpty() ||
      !postContent.categoryId ||
      postContent.title.length > TITLE_MAX_LENGTH
    ) {
      toast.error("Please fill out all fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const category = categories.find((c) => c.id === postContent.categoryId);

      const newPostData = {
        title: postContent.title.trim(),
        description: postContent.description,
        categoryId: postContent.categoryId,
        categoryName: category?.name || "",
        categorySlug: category?.slug || "",
        authorId: user.uid,
        authorName: profile.displayName || user.email?.split("@")[0] || "User",
        authorEmail: user.email || null,
        authorPhotoURL: profile.photoURL || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true,
        imagePublicId: postContent.imagePublicId || "",
        likeCount: 0,
        likedBy: [],
        dislikedBy: [],
        favoritedBy: [],
      };

      await addDoc(collection(db, "posts"), newPostData);

      resetForm();
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPostContent({
      title: "",
      description: "",
      categoryId: "",
      imagePublicId: "",
    });
    setTimeout(() => {
      const editorElement = document.querySelector(".ProseMirror");
      if (editorElement) editorElement.innerHTML = "";
    }, 10);
  };

  if (authLoading || dataLoading || profileLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="text-white w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0">
      <PostForm
        categories={categories}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        postContent={postContent}
        setPostContent={setPostContent}
        titleMaxLength={TITLE_MAX_LENGTH}
        descriptionMaxLength={DESCRIPTION_MAX_LENGTH}
      />
      <div className="border-b border-zinc-800 my-3" />
      <div className="flex justify-center mb-6">
        {selectedCategory && (
          <button
            onClick={() => router.push("/categories")}
            className="px-4 py-2 bg-red-500 capitalize cursor-pointer text-white rounded-lg transition-colors"
          >
            {selectedCategory} - Clear Filter
          </button>
        )}
      </div>
      <PostList
        posts={posts}
        isLoading={!!deletingId}
        error={error}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
