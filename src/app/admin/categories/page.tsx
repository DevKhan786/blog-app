"use client";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { CategoryWithId } from "../../../../types/types";
import { db } from "../../../../lib/firebase/firebase";
import CategoryCard from "@/components/CategoryCard";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "",
        slug: doc.data().slug || "",
        imageUrl: doc.data().imageUrl || "",
        createdAt: doc.data().createdAt,
      }));
      categoryList.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCategories(categoryList);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryDeleted = (deletedId: string) => {
    setCategories((current) =>
      current.filter((category) => category.id !== deletedId)
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-6 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Categories</h1>
        <Link href="/admin/categories/new" className="w-full sm:w-auto">
          <Button className="cursor-pointer w-full sm:w-auto flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <CirclePlus className="size-4 sm:size-5" />
            <span>Add Category</span>
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-400 text-sm">Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-8 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <h3 className="text-base font-medium text-gray-300 mb-3">
            No categories found
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Get started by creating your first category
          </p>
          <Link href="/admin/categories/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 transition-colors">
              Create New Category
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDelete={handleCategoryDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
