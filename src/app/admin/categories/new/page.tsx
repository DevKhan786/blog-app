"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, ImagePlus, Loader2, X } from "lucide-react";
import { useCategoryForm } from "./contexts/CategoryFormContext";
import Image from "next/image";

const CategoryFormPage = () => {
  const {
    data,
    loading,
    error,
    success,
    handleData,
    handleCreate,
    image,
    setImage,
    clearNotifications,
  } = useCategoryForm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        clearNotifications();
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [success, clearNotifications]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
  };

  return (
    <div className="flex flex-col w-full items-center min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-6 text-center text-gray-800">
          Add New Category
        </h1>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in">
            <AlertDescription className="text-sm flex items-center">
              <X className="mr-2 h-4 w-4" />
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 animate-in fade-in bg-green-50 text-green-800 border-green-200">
            <AlertDescription className="text-sm flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Category Name
            </Label>
            <Input
              placeholder="Enter category name"
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={(e) => handleData("name", e.target.value)}
              className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
              Category Slug
            </Label>
            <Input
              placeholder="enter-category-slug"
              id="slug"
              name="slug"
              type="text"
              value={data.slug}
              onChange={(e) => handleData("slug", e.target.value)}
              className="mt-1 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Used in URLs, lowercase with hyphens instead of spaces
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="image"
              className="text-sm font-medium text-gray-700"
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
                onChange={(e) => {
                  e.preventDefault();
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                }}
                className="hidden"
                required
              />

              <div
                onClick={triggerFileInput}
                className={`relative w-full h-40 sm:h-48 rounded-md overflow-hidden border-2 border-dashed transition-all ${
                  image
                    ? "border-gray-200 bg-transparent"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                {image ? (
                  <>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="Category preview"
                      className="w-full h-full object-contain"
                      fill
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                      {image.name}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <ImagePlus size={32} className="text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm">
                      Click to select an image
                    </span>
                    <span className="text-gray-400 text-xs mt-1">
                      JPG, PNG, WebP formats
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full mt-4 py-6 text-base font-medium transition-all ${
              loading || !data.name || !data.slug || !image
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary/90 cursor-pointer"
            }`}
            disabled={loading || !data.name || !data.slug || !image}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormPage;
