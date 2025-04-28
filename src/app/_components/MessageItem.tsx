"use client";

import { type FC } from "react";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

const MessageItem: FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isCurrentUser = message.author.id === currentUserId;

  return (
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

        <div>
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

          <div className={`rounded-lg p-3 ${isCurrentUser
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 