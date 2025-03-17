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

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
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
          } as CategoryWithId;

          setCategory(categoryData);
          setFormData({
            name: categoryData.name,
            slug: categoryData.slug,
          });
        } else {
          setError("Category not found");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setChangeImage(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
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

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const imageData = await uploadResponse.json();
        imageUrl = imageData.imageUrl;
      }

      await updateDoc(categoryRef, {
        name: formData.name,
        slug: formData.slug,
        ...(imageUrl !== category?.imageUrl ? { imageUrl } : {}),
        updatedAt: new Date().toISOString(),
      });

      setSuccess(`Category "${formData.name}" has been updated!`);

      setTimeout(() => {
        router.push("/admin/categories");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="h-16 w-16 animate-spin text-indigo-500">
          <Loader2 className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="container mx-auto p-4 bg-black text-white">
        <Alert
          variant="destructive"
          className="mb-4 bg-red-900/30 border border-red-700 text-red-200"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/admin/categories">
          <Button className="hoverEffect">Back to Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center min-h-screen p-4 md:p-6 bg-black">
       <Link
        href="/admin/categories"
        className=" px-8 hover:bg-indigo-600 duration-300 transition-all bg-red-500 py-2 mb-8 rounded-2xl"
      >
        Back
      </Link>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-6 text-center text-white">
          Edit Category
        </h1>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-900/30 border border-red-700 text-red-200"
          >
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-indigo-900/30 border border-indigo-700 text-indigo-200">
            <AlertDescription className="text-sm">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={updateCategory} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Category Name
            </Label>
            <Input
              placeholder="Enter category name"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-300">
              Category Slug
            </Label>
            <Input
              placeholder="enter-category-slug"
              id="slug"
              name="slug"
              type="text"
              value={formData.slug}
              onChange={handleChange}
              className="mt-1 bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Used in URLs, lowercase with hyphens instead of spaces
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="image"
              className="text-sm font-medium text-gray-300"
            >
              Category Image
            </Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {!changeImage && category?.imageUrl ? (
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-2">Current image:</p>
                  <div className="relative h-40 w-full bg-zinc-800 rounded-md overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer mt-2 w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                    onClick={() => setChangeImage(true)}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className={`relative w-full h-40 sm:h-48 rounded-md overflow-hidden border-2 border-dashed transition-all cursor-pointer ${
                    image
                      ? "border-indigo-600 bg-transparent"
                      : "border-zinc-700 bg-zinc-800 hover:border-indigo-500"
                  }`}
                >
                  {image ? (
                    <>
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Category preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-zinc-800 rounded-full p-1 shadow-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X size={16} className="text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                        {image.name}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImagePlus size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-300 text-sm">
                        Click to select a new image
                      </span>
                      <span className="text-gray-400 text-xs mt-1">
                        JPG, PNG, WebP formats
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Link href="/admin/categories" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="cursor-pointer flex-1 hoverEffect"
              disabled={
                loading ||
                !formData.name ||
                !formData.slug ||
                (changeImage && !image)
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Category"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
