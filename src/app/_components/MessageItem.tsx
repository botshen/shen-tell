"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { api } from "~/trpc/react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

// 定义留言类型
export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  comments: Comment[];
};

// 定义评论类型
export type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
};

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

export default function MessageItem({ message, currentUserId }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const utils = api.useUtils();

  // 删除留言
  const deleteMessage = api.message.delete.useMutation({
    onSuccess: async () => {
      await utils.message.getAll.invalidate();
    },
  });

  // 更新留言
  const updateMessage = api.message.update.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await utils.message.getAll.invalidate();
    },
  });

  // 格式化日期
  const formattedDate = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  // 处理删除留言
  const handleDelete = () => {
    if (window.confirm("确定要删除这条留言吗？")) {
      deleteMessage.mutate({
        id: message.id,
        authorId: currentUserId,
      });
    }
  };

  // 处理更新留言
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedContent.trim() === "") return;

    updateMessage.mutate({
      id: message.id,
      content: editedContent,
      authorId: currentUserId,
    });
  };

  // 判断当前用户是否是作者
  const isAuthor = message.author.id === currentUserId;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      {/* 留言头部 */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={message.author.avatar}
          alt={message.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-medium">{message.author.name}</div>
          <div className="text-xs text-gray-500">{formattedDate}</div>
        </div>
      </div>

      {/* 留言内容 */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-gray-100 rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md"
              disabled={updateMessage.isPending}
            >
              {updateMessage.isPending ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-3 whitespace-pre-wrap">{message.content}</div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-between items-center mb-3 text-sm">
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="text-gray-500 hover:text-gray-700"
        >
          {showCommentForm ? "取消回复" : "回复"}
        </button>

        {isAuthor && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
              disabled={isEditing}
            >
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
              disabled={deleteMessage.isPending}
            >
              {deleteMessage.isPending ? "删除中..." : "删除"}
            </button>
          </div>
        )}
      </div>

      {/* 评论表单 */}
      {showCommentForm && (
        <div className="mb-4">
          <CommentForm
            messageId={message.id}
            userId={currentUserId}
            onSuccess={() => setShowCommentForm(false)}
          />
        </div>
      )}

      {/* 评论列表 */}
      {message.comments && message.comments.length > 0 && (
        <div className="pl-4 border-l-2 border-gray-100 mt-4 space-y-3">
          {message.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              messageId={message.id}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
} 