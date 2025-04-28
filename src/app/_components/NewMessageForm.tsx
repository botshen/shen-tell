"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface NewMessageFormProps {
  userId: string;
}

export default function NewMessageForm({ userId }: NewMessageFormProps) {
  const [content, setContent] = useState("");

  const utils = api.useUtils();

  const createMessage = api.message.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.message.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;

    createMessage.mutate({
      content,
      authorId: userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的留言..."
          className="w-full border border-gray-300 rounded-md p-3 min-h-[100px]"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={createMessage.isPending || content.trim() === ""}
        >
          {createMessage.isPending ? "发布中..." : "发布留言"}
        </button>
      </div>
    </form>
  );
} 