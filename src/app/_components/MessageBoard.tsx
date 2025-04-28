"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import MessageItem from "./MessageItem";
import NewMessageForm from "./NewMessageForm";
import NavBar from "./NavBar";

// 添加消息类型定义
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

export default function MessageBoard() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  }>({
    id: "user-1", // 假设的固定ID，实际应用中应该使用真实的用户认证
    name: "李华",
    avatar: "/me.jpeg",
  });

  // 使用tRPC钩子获取所有留言
  const { data: messages, isLoading } = api.message.getAll.useQuery(undefined, {
    refetchInterval: 5000, // 每5秒刷新一次数据
  });

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar user={currentUser} />

      <div className="flex-1 w-full max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">留言列表</h1>

        {/* 添加新留言的表单 */}
        <div className="mb-8">
          <NewMessageForm userId={currentUser.id} />
        </div>

        {/* 留言列表 */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">加载中...</div>
          ) : messages && messages.length > 0 ? (
            messages.map((message: Message) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUserId={currentUser.id}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">暂无留言</div>
          )}
        </div>
      </div>
    </div>
  );
} 