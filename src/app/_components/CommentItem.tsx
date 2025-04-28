"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { api } from "~/trpc/react";
import type { Comment } from "./MessageItem";

interface CommentItemProps {
  comment: Comment;
  messageId: number;
  currentUserId: string;
}

export default function CommentItem({ comment, messageId, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const utils = api.useUtils();

  // 删除评论
  const deleteComment = api.comment.delete.useMutation({
    onSuccess: async () => {
      await utils.message.getAll.invalidate();
    },
  });

  // 更新评论
  const updateComment = api.comment.update.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await utils.message.getAll.invalidate();
    },
  });

  // 格式化日期
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  // 处理删除评论
  const handleDelete = () => {
    if (window.confirm("确定要删除这条评论吗？")) {
      deleteComment.mutate({
        id: comment.id,
        authorId: currentUserId,
      });
    }
  };

  // 处理更新评论
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedContent.trim() === "") return;

    updateComment.mutate({
      id: comment.id,
      content: editedContent,
      authorId: currentUserId,
    });
  };

  // 判断当前用户是否是作者
  const isAuthor = comment.author.id === currentUserId;

  return (
    <div className="py-2">
      {/* 评论头部 */}
      <div className="flex items-center gap-2 mb-2">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="w-6 h-6 rounded-full object-cover"
        />
        <div className="text-sm font-medium">{comment.author.name}</div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>

      {/* 评论内容 */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 text-sm"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 text-xs bg-gray-100 rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md"
              disabled={updateComment.isPending}
            >
              {updateComment.isPending ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm mb-2">{comment.content}</div>
      )}

      {/* 操作按钮 */}
      {isAuthor && !isEditing && (
        <div className="flex gap-3 text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
            disabled={deleteComment.isPending}
          >
            {deleteComment.isPending ? "删除中..." : "删除"}
          </button>
        </div>
      )}
    </div>
  );
} 