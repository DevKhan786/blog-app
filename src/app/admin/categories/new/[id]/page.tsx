"use client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../../../../../../lib/firebase/firebase";
import { CategoryWithId } from "../../../../../../types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EditCategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const categoryRef = doc(db, "categories", categoryId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<CategoryWithId | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [image, setImage] = useState<File | null>(null);
  const [changeImage, setChangeImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const categorySnapshot = await getDoc(categoryRef);
        if (categorySnapshot.exists()) {
          const data = categorySnapshot.data();
          const categoryData = {
            id: categoryId,
            name: data.name || "",
            slug: data.slug || "",
            imageUrl: data.imageUrl || "",
            createdAt: data.createdAt,
          };
          setCategory(categoryData);
          setFormData({ name: categoryData.name, slug: categoryData.slug });
        } else setError("Category not found");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setChangeImage(true);
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      let imageUrl = category?.imageUrl;
      if (changeImage && image) {
        const formData = new FormData();
        formData.append("file", image);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error("Failed to upload image");
        const imageData = await uploadResponse.json();
        imageUrl = imageData.imageUrl;
      }
      await updateDoc(categoryRef, {
        name: formData.name,
        slug: formData.slug,
        ...(imageUrl !== category?.imageUrl ? { imageUrl } : {}),
        updatedAt: new Date().toISOString(),
      });
      setSuccess(`Category "${formData.name}" updated!`);
      setTimeout(() => router.push("/admin/categories"), 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-indigo-500" />
      </div>
    );

  if (error && !category)
    return (
      <div className="container mx-auto p-4 text-white">
        <Alert
          variant="destructive"
          className="mb-4 bg-red-900/30 border-red-700"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/admin/categories">
          <Button className="hover:bg-indigo-700 transition-colors">
            Back to Categories
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="flex flex-col w-full items-center min-h-screen p-4 sm:p-6">
      <Link
        href="/admin/categories"
        className="w-full max-w-xs sm:max-w-md mb-6 sm:mb-8"
      >
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
          size="sm"
        >
          Back to Categories
        </Button>
      </Link>

      <div className="w-full max-w-xs sm:max-w-md bg-zinc-900 border-zinc-800 rounded-lg shadow-md p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center text-white">
          Edit Category
        </h1>

        {error && (
          <Alert
            variant="destructive"
            className="mb-4 bg-red-900/30 border-red-700"
          >
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-indigo-900/30 border-indigo-700">
            <AlertDescription className="text-sm">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={updateCategory} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Category Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Category Slug</Label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-gray-400">
              Use lowercase with hyphens (e.g., "category-name")
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Category Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {!changeImage && category?.imageUrl ? (
              <div className="space-y-2">
                <div className="relative h-32 sm:h-40 bg-zinc-800 rounded-md overflow-hidden">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setChangeImage(true)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-32 sm:h-40 rounded-md border-2 border-dashed ${
                  image
                    ? "border-indigo-600"
                    : "border-zinc-700 hover:border-indigo-500"
                } transition-colors cursor-pointer bg-zinc-800`}
              >
                {image ? (
                  <>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(null);
                      }}
                      className="absolute top-2 right-2 bg-zinc-800 rounded-full p-1 hover:bg-zinc-700 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ImagePlus className="h-8 w-8 mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Link href="/admin/categories" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
              disabled={loading || !formData.name || !formData.slug}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
