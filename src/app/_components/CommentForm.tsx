"use client";

import { useState, type FC } from "react";
import { api } from "~/trpc/react";

interface CommentFormProps {
  messageId: number;
  currentUserId: string;
}

const CommentForm: FC<CommentFormProps> = ({ messageId, currentUserId }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();

  // 创建评论
  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      setContent("");
      setIsSubmitting(false);
      void utils.message.getAll.invalidate();
    },
    onError: (error) => {
      console.error("评论创建失败", error);
      setIsSubmitting(false);
      alert("评论发送失败，请稍后重试");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    createComment.mutate({
      content,
      messageId,
      authorId: currentUserId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="添加评论..."
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="rounded-md bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "发送中..." : "发送"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 