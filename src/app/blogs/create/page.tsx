"use client";

import { useState } from "react";
import TextEditor from "../../../../components/rich-text-editor/index";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CreatePostPage = () => {
  const [postContent, setPostContent] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting post:", postContent);
    // Save to Firebase
  };

  return (
    <div className="text-white w-full">
      <div className="flex justify-between items-center mb-6">
        <Link href="/blogs">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 bg-zinc-900 border-zinc-800 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-white text-center">
          Create New Post
        </h1>
        <div className="w-20"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 md:p-6"
      >
        <input
          type="text"
          placeholder="Post Title"
          value={postContent.title}
          onChange={(e) =>
            setPostContent((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full text-2xl font-bold mb-4 p-2 border-b border-zinc-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        />

        <TextEditor
          onChange={(html) =>
            setPostContent((prev) => ({ ...prev, description: html }))
          }
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" className="px-6 py-2 hoverEffect">
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
