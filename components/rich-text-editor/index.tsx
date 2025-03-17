"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menubar";
import { FC } from "react";
interface TextEditorProps {
  content?: string;
  onChange: (content: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "<p>Start writing...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 border-x border-b border-zinc-700 rounded-b-lg focus:outline-none prose prose-invert max-w-none bg-zinc-900 text-white",
      },
    },
  });

  return (
    <div className="rounded-lg shadow-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
