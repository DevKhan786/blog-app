"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Heading1,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import React from "react";
import { Editor } from "@tiptap/core";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  const formattingOptions = [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-gray-50">
      {formattingOptions.map((option, index) => (
        <Toggle
          key={index}
          size="sm"
          pressed={option.pressed}
          onPressedChange={option.onClick}
          className="data-[state=on]:bg-gray-200 hover:bg-gray-100"
          disabled={!editor.isEditable}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
};

export default MenuBar;
