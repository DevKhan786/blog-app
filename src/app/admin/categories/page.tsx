"use client";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import CategoryCard from "../../components/CategoryCard";
import { CategoryWithId } from "../../../../types/types";
import { db } from "../../../../lib/firebase/firebase";

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
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Categories
        </h1>
        <Link href="/admin/categories/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto flex items-center gap-1.5 px-4 py-2.5">
            <CirclePlus className="size-4 sm:size-5" />
            <span>Add Category</span>
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 sm:p-4 rounded-lg mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12 sm:py-20">
          <p className="text-gray-500 text-sm sm:text-base">
            Loading categories...
          </p>
        </div>
      ) : /* Empty State */
      categories.length === 0 ? (
        <div className="text-center py-8 sm:py-16 bg-gray-50 rounded-lg">
          <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-3">
            No categories found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-4">
            Get started by creating your first category
          </p>
          <Link href="/admin/categories/new">
            <Button className="px-6 py-3 text-sm sm:text-base">
              Create New Category
            </Button>
          </Link>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
