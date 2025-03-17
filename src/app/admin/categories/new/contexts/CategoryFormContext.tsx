"use client";
import { createContext, useContext, useState, ReactNode } from "react";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../../../../lib/firebase/firebase";
import { Category, CategoryWithId } from "../../../../../../types/types";

interface CategoryFormContextType {
  data: Category;
  loading: boolean;
  error: string | null;
  success: string | null;
  image: File | null;
  handleData: (key: keyof Category, value: any) => void;
  handleCreate: () => Promise<void>;
  setImage: (file: File | null) => void;
  clearNotifications: () => void;
}

const CategoryFormContext = createContext<CategoryFormContextType | undefined>(
  undefined
);

export default function CategoryFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<Category>({
    name: "",
    slug: "",
    imageUrl: "",
    createdAt: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  const handleData = (key: keyof Category, value: any) => {
    // Clear notifications when user starts editing again
    if (error || success) {
      clearNotifications();
    }

    setData({
      ...data,
      [key]: value,
    });
  };

  const handleCreate = async () => {
    clearNotifications();
    setLoading(true);

    try {
      if (!image) {
        throw new Error("Please select an image");
      }

      // Create form data for the API
      const formData = new FormData();
      formData.append("file", image);

      // Upload to our API route (which then uploads to Cloudinary)
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const { imageUrl } = await uploadResponse.json();

      const categoryData = {
        ...data,
        imageUrl,
        createdAt: new Date().toISOString(),
      };

      // Save to Firebase Firestore
      const docRef = await addDoc(collection(db, "categories"), categoryData);

      console.log("Category created with ID: ", docRef.id);

      // Set success message
      setSuccess(`Category "${data.name}" has been successfully created!`);

      // Reset form after success
      setData({
        name: "",
        slug: "",
        imageUrl: "",
        createdAt: null,
      });
      setImage(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryFormContext.Provider
      value={{
        data,
        loading,
        error,
        success,
        handleData,
        handleCreate,
        image,
        setImage,
        clearNotifications,
      }}
    >
      {children}
    </CategoryFormContext.Provider>
  );
}

export const useCategoryForm = (): CategoryFormContextType => {
  const context = useContext(CategoryFormContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryForm must be used within a CategoryFormProvider"
    );
  }
  return context;
};
