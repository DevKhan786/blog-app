"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CategoryWithId } from "../../../types/types";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";
import { useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";

interface CategoryCardProps {
  category: CategoryWithId;
  onDelete?: (id: string) => void;
}

const CategoryCard = ({ category, onDelete }: CategoryCardProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const categoryRef = doc(db, "categories", category.id);
      await deleteDoc(categoryRef);

      setIsDeleted(true);

      if (onDelete) {
        onDelete(category.id);
      }

      setTimeout(() => {
        setShowConfirm(false);
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete category"
      );
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="relative bg-white  overflow-hidden rounded-2xl shadow-sm border border-black transition-all hover:shadow-md p-2">
      {showConfirm && (
        <div className="absolute inset-0 bg-black/80 z-10 flex flex-col items-center justify-center p-4 text-white">
          {loading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Deleting...</p>
            </div>
          ) : (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-bold mb-2 uppercase">
                Delete Category?
              </h3>
              <p className="text-sm uppercase text-red-500 font-semibold text-center mb-4">
                Are you sure you want to delete "{category.name}"?
              </p>

              <div className="flex gap-3 w-full max-w-xs">
                <Button
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="absolute top-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-20 flex items-center">
          <span className="flex-1">{error}</span>
          <X
            size={16}
            className="cursor-pointer"
            onClick={() => setError(null)}
          />
        </div>
      )}

      <div className="relative h-48 border border-black rounded-2xl ">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-contain p-2"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg text-gray-800">{category.name}</h3>
        <p className="font-light text-xs text-gray-800">
          Slug: {category.slug}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {category.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
              : "No date"}
          </span>
          <div className="flex gap-2">
            <Link href={`/admin/categories/new/${category.id}`}>
              <Button className="cursor-pointer" variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              className="cursor-pointer bg-white text-red-500 hover:bg-red-50 border border-red-300 hover:border-red-400"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
