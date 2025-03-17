import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        <LoaderIcon className="animate-spin h-12 w-12 text-indigo-500" />
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
