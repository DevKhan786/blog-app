"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import MenuBar from "./menubar";
import { FC, useEffect, useState } from "react";
import CharacterCount from "@tiptap/extension-character-count";
import { useAuth } from "../../lib/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  maxLength: number;
  isDisabled: boolean;
}

const TextEditor: FC<TextEditorProps> = ({
  value,
  onChange,
  isSubmitting,
  handleSubmit,
  maxLength,
  isDisabled,
}) => {
  const [charactersLeft, setCharactersLeft] = useState(maxLength);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { user } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto mx-auto",
          style: "max-width: min(100%, 200px);",
        },
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value,
    editable: !!user,
    onUpdate: ({ editor }) => {
      if (!user) return;
      const html = editor.getHTML();
      onChange(html);
      const textContent = editor.getText();
      setCharactersLeft(maxLength - textContent.length);
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!user) {
          toast.error("Please login to add images");
          return false;
        }
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = async () => {
              const imageUrl = await handleImageUpload(file);
              if (imageUrl && editor) {
                editor.chain().focus().setImage({ src: imageUrl }).run();
              }
            };
            reader.readAsArrayBuffer(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (!user) {
          toast.error("Please login to create posts");
          return false;
        }
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file && editor) {
                const reader = new FileReader();
                reader.onload = async () => {
                  const imageUrl = await handleImageUpload(file);
                  if (imageUrl) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                  }
                };
                reader.readAsArrayBuffer(file);
                return true;
              }
            }
          }
        }
        return false;
      },
      attributes: {
        class: `min-h-[30px] p-1 sm:p-2 border-x border-b border-zinc-700 rounded-b-lg focus:outline-none prose prose-invert max-w-none bg-black text-white relative ${
          !user ? "opacity-50 cursor-not-allowed" : ""
        }`,
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    try {
      if (!user) {
        toast.error("You must be logged in to post!");
        return null;
      }

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
      console.error("Upload error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!user);
      setIsEditorReady(true);
    }
  }, [editor, user]);

  useEffect(() => {
    if (editor && maxLength) {
      editor.setOptions({
        editorProps: {
          handleKeyDown: (view, event) => {
            const textContent = editor.getText();

            if (
              event.key === "Backspace" ||
              event.key === "Delete" ||
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight" ||
              event.key === "ArrowUp" ||
              event.key === "ArrowDown" ||
              event.metaKey ||
              event.ctrlKey
            ) {
              return false;
            }

            if (textContent.length >= maxLength) {
              return true;
            }

            return false;
          },
        },
      });
    }
  }, [editor, maxLength]);

  if (!editor || !isEditorReady) {
    return (
      <div className="rounded-lg shadow-md relative h-24 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md relative">
      <MenuBar
        handleSubmit={handleSubmit}
        editor={editor}
        isSubmitting={isSubmitting}
        isDisabled={!user}
      />

      <div className="relative">
        <EditorContent editor={editor} />
        <div
          className={`absolute bottom-1 right-2 text-[0.6rem] sm:text-xs ${
            charactersLeft < 40
              ? "text-red-400"
              : charactersLeft < 80
              ? "text-green-500"
              : "text-zinc-500"
          }`}
        >
          {charactersLeft}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
