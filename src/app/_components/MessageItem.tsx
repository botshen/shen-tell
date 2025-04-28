"use client";

import { useState, type FC } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { formatEmoji } from "~/utils/formatEmoji";
import dynamic from "next/dynamic";

const CommentList = dynamic(() => import("./CommentList"), { ssr: false });
const CommentForm = dynamic(() => import("./CommentForm"), { ssr: false });

interface Comment {
  id: number;
  content: string;
  authorId: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Message {
  id: number;
  content: string;
  authorId: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  comments: Comment[];
}

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

const MessageItem: FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isCurrentUser = message.author.id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showComments, setShowComments] = useState(false);

  const utils = api.useUtils();

  // 删除留言
  const deleteMessage = api.message.delete.useMutation({
    onSuccess: () => {
      void utils.message.getAll.invalidate();
    },
  });

  // 更新留言
  const updateMessage = api.message.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void utils.message.getAll.invalidate();
    },
  });

  const handleDelete = () => {
    if (window.confirm("确定要删除这条留言吗？")) {
      deleteMessage.mutate({
        id: message.id,
        authorId: currentUserId
      });
    }
  };

  const handleUpdate = () => {
    if (editContent.trim() === "") return;
    updateMessage.mutate({
      id: message.id,
      content: editContent,
      authorId: currentUserId
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const formattedContent = formatEmoji ? formatEmoji(message.content) : message.content;

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={message.author.avatar}
              alt={message.author.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">{message.author.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`rounded-lg p-3 ${isCurrentUser
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />

                <div className="mt-2 flex items-center gap-4">
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showComments ? "隐藏评论" : `${message.comments.length > 0 ? `${message.comments.length} 条` : ""}评论`}
                  </button>

                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        编辑
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        删除
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 评论区域 */}
            {showComments && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <CommentList comments={message.comments} currentUserId={currentUserId} messageId={message.id} />
                <div className="mt-2">
                  <CommentForm messageId={message.id} currentUserId={currentUserId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 