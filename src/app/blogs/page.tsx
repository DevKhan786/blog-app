"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../../../lib/contexts/AuthContext";
import { CategoryWithId, Posts } from "../../../types/types";
import { db } from "../../../lib/firebase/firebase";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { useUserProfile } from "../../../lib/hooks/useUserProfile";

const TITLE_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 100;

const BlogsPage = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile(user);
  const [postContent, setPostContent] = useState({
    title: "",
    description: "",
    categoryId: "",
    imagePublicId: "",
  });
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Posts[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, []);

  const fetchCategories = async () => {
    setError(null);
    try {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        slug: doc.data().slug || "",
        imageUrl: doc.data().imageUrl || "",
        createdAt: doc.data().createdAt || new Date().toISOString(),
      }));
      categoryList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCategories(categoryList);
    } catch (error) {
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    setError(null);
    try {
      const postSnapshot = await getDocs(collection(db, "posts"));
      const postsList = postSnapshot.docs.map((doc) => {
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
        } as Posts;
      });

      postsList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(postsList);
    } catch (error) {
      setError("Failed to load posts");
      toast.error("Failed to load posts");
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
      if (postData.authorId !== user.uid) {
        toast.error("You can only delete your own posts");
        return;
      }

      await deleteDoc(postRef);

      if (postData.imagePublicId) {
        await fetch("/api/delete-image", {
          method: "POST",
          body: JSON.stringify({ publicId: postData.imagePublicId }),
          headers: { "Content-Type": "application/json" },
        });
      }

      toast.success("Post deleted successfully");
      fetchPosts();
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
      await addDoc(collection(db, "posts"), {
        ...postContent,
        title: postContent.title.trim(),
        categoryName:
          categories.find((c) => c.id === postContent.categoryId)?.name || "",
        authorId: user.uid,
        authorName: profile.displayName || user.email?.split("@")[0] || "User",
        authorPhotoURL: profile.photoURL || null,
        createdAt: new Date().toISOString(),
        imagePublicId: postContent.imagePublicId,
      });
      await fetchPosts();
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-white text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-white w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 ">
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
      <PostList
        posts={posts}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
};

export default BlogsPage;
