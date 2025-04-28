"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface CommentFormProps {
  messageId: number;
  userId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ messageId, userId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");

  const utils = api.useUtils();

  const createComment = api.comment.create.useMutation({
    onSuccess: async () => {
      setContent("");
      await utils.message.getAll.invalidate();
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;

    createComment.mutate({
      content,
      authorId: userId,
      messageId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的评论..."
        className="w-full border border-gray-300 rounded-md p-2 mb-2 text-sm"
        rows={2}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
          disabled={createComment.isPending || content.trim() === ""}
        >
          {createComment.isPending ? "发布中..." : "发布评论"}
        </button>
      </div>
    </form>
  );
} 