"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface NewMessageFormProps {
  userId: string;
}

export default function NewMessageForm({ userId }: NewMessageFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();

  // 创建新留言的mutation
  const createMessage = api.message.create.useMutation({
    onSuccess: async () => {
      setContent("");
      setIsSubmitting(false);
      await utils.message.getAll.invalidate();
    },
    onError: () => {
      setIsSubmitting(false);
      alert("发送留言失败，请重试");
    }
  });

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === "") return;

    setIsSubmitting(true);
    createMessage.mutate({
      content,
      authorId: userId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="mb-3">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          发表留言
        </label>
        <textarea
          id="message"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在这里输入你的留言..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || content.trim() === ""}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "发送中..." : "发送留言"}
        </button>
      </div>
    </form>
  );
} 