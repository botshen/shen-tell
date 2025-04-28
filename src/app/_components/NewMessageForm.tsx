"use client";

import { useState, type FC } from "react";
import { api } from "~/trpc/react";

interface NewMessageFormProps {
  userId: string;
}

const NewMessageForm: FC<NewMessageFormProps> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();

  // 创建留言
  const createMessage = api.message.create.useMutation({
    onSuccess: () => {
      setContent("");
      setIsSubmitting(false);
      void utils.message.getAll.invalidate();
    },
    onError: (error) => {
      console.error("留言创建失败", error);
      setIsSubmitting(false);
      alert("留言发送失败，请稍后重试");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    createMessage.mutate({
      content,
      authorId: userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的留言..."
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "发送中..." : "发送留言"}
        </button>
      </div>
    </form>
  );
};

export default NewMessageForm; 