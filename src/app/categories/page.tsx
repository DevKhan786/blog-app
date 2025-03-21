"use client";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase/firebase";
import toast from "react-hot-toast";
import { CategoryWithId } from "../../../types/types";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const CategoriesPage = () => {
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
      toast.error("Failed to load categories");
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mt-8 mb-8 text-center">
        All Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blogs?category=${category.slug}`}
            className="group relative block h-64 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
            )}

            <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/60" />

            <div className="relative h-full flex flex-col justify-end p-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                {category.name}
              </h2>
              <p className="text-sm text-zinc-300">
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
