// app/blog/create/page.tsx
"use client";

import { useState } from "react";
import TextEditor from "../../../components/rich-text-editor/index";

const CreatePostPage = () => {
  const [postContent, setPostContent] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save to Firebase
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title"
          className="w-full text-2xl font-bold mb-4 p-2 border-b"
        />

        <TextEditor onChange={(html) => setPostContent(html)} />

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
