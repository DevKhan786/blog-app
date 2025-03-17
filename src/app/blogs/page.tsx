import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const BlogsPage = () => {
  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <Link href="/blogs/create">
          <Button className="w-full hoverEffect" variant="outline">
            Create Post
          </Button>
        </Link>
      </div>

      {/* Blog posts will be displayed here */}
      <div className="flex-1">
        <p className="text-gray-400 text-center py-16">
          No blog posts yet. Create your first post!
        </p>
      </div>
    </div>
  );
};

export default BlogsPage;
