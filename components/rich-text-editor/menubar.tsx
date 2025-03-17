"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Heading1,
  List,
  ListOrdered,
  Strikethrough,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import React, { useRef } from "react";
import { Editor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../lib/contexts/AuthContext";
import toast from "react-hot-toast";

interface MenuBarProps {
  editor: Editor | null;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isDisabled: boolean;
}

const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  isSubmitting,
  handleSubmit,
  isDisabled,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleAddImage = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          editor
            .chain()
            .focus()
            .setImage({
              src: imageUrl,
              alt: "Post image",
              title: "Post image",
            })
            .command(({ commands }) => {
              return commands.updateAttributes("image", {
                class: "max-w-full h-auto rounded-lg mx-auto",
                style: "max-width: min(100%, 300px);",
              });
            })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/post/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      const { imageUrl } = await response.json();
      return imageUrl;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  if (!editor) return null;

  const formattingOptions = [
    {
      icon: <Bold className="h-4 w-4" />,
      command: "toggleBold" as const,
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      command: "toggleItalic" as const,
      isActive: editor.isActive("italic"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      command: "toggleHeading" as const,
      args: [{ level: 1 as const }],
      isActive: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <List className="h-4 w-4" />,
      command: "toggleBulletList" as const,
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      command: "toggleOrderedList" as const,
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      command: "toggleStrike" as const,
      isActive: editor.isActive("strike"),
    },
  ];

  return (
    <div className="flex flex-wrap justify-between items-center p-1 border rounded-t-lg bg-black border-zinc-700 gap-1">
      <div className="flex flex-wrap gap-1">
        {formattingOptions.map((option, index) => (
          <Toggle
            key={index}
            size="sm"
            pressed={option.isActive}
            onPressedChange={() => {
              const chain = editor.chain().focus();
              if (option.args) {
                (chain[option.command] as any)(...Object.values(option.args));
              } else {
                (chain[option.command] as any)();
              }
              chain.run();
            }}
            className="cursor-pointer data-[state=on]:bg-indigo-600 hover:bg-zinc-700 text-white h-7 w-7 p-1.5"
            disabled={isDisabled}
          >
            {option.icon}
          </Toggle>
        ))}
        <Toggle
          size="sm"
          pressed={false}
          onPressedChange={handleAddImage}
          className="cursor-pointer hover:bg-zinc-700 text-white h-7 w-7 p-1.5"
          disabled={isDisabled}
        >
          <ImageIcon className="h-4 w-4" />
        </Toggle>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        className={`cursor-pointer h-7 px-3 text-sm ${
          user
            ? "bg-white text-black hover:bg-indigo-100"
            : "bg-zinc-800 cursor-not-allowed"
        }`}
        variant="ghost"
        disabled={isSubmitting || !user}
        onClick={handleSubmit}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
      </Button>
    </div>
  );
};

export default MenuBar;
