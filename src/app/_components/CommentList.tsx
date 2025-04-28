"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { formatEmoji } from "~/utils/formatEmoji";

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

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  messageId: number;
}

const CommentList: FC<CommentListProps> = ({ comments, currentUserId, messageId }) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const utils = api.useUtils();

  // 删除评论
  const deleteComment = api.comment.delete.useMutation({
    onSuccess: () => {
      void utils.message.getAll.invalidate();
    },
  });

  // 更新评论
  const updateComment = api.comment.update.useMutation({
    onSuccess: () => {
      setEditingCommentId(null);
      void utils.message.getAll.invalidate();
    },
  });

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("确定要删除这条评论吗？")) {
      deleteComment.mutate({
        id: commentId,
        authorId: currentUserId
      });
    }
  };

  const handleUpdateComment = (commentId: number) => {
    if (editContent.trim() === "") return;
    updateComment.mutate({
      id: commentId,
      content: editContent,
      authorId: currentUserId
    });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  if (comments.length === 0) {
    return <div className="py-2 text-sm text-gray-500">暂无评论</div>;
  }

  return (
    <div className="space-y-3">
      {comments
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((comment) => {
          const isCurrentUser = comment.author.id === currentUserId;
          const isEditing = comment.id === editingCommentId;
          const formattedContent = formatEmoji(comment.content);

          return (
            <div key={comment.id} className="group">
              <div className="flex items-start space-x-2">
                <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="mt-1 space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-xs"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: formattedContent }}
                      />

                      {isCurrentUser && (
                        <div className="mt-1 flex items-center gap-3">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            </svg>
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            删除
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CommentList; 