"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import MessageItem from "./MessageItem";
import NewMessageForm from "./NewMessageForm";
import NavBar from "./NavBar";

// 添加消息类型定义
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
  comments: {
    id: number;
    content: string;
    authorId: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
}

// 用户类型定义
interface User {
  id: string;
  name: string;
  avatar: string;
}

export default function MessageBoard() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "user-2", // 默认用户，将从数据库中获取真实用户
    name: "漫漫🐟",
    avatar: "/you.jpeg",
  });

  // 获取用户列表
  const { data: usersList } = api.user.getAll.useQuery();

  // 创建用户的 mutation
  const createUser = api.user.create.useMutation();

  // 当用户列表加载完成时，设置当前用户
  useEffect(() => {
    if (usersList && usersList.length > 0) {
      setUsers(usersList);
      if (usersList[1]) {
        setCurrentUser(usersList[1]);
      }
    } else if (usersList && usersList.length === 0) {
      // 如果没有用户，创建默认用户
      createDefaultUsers();
    }
  }, [usersList]);

  // 如果没有用户，创建默认用户
  const createDefaultUsers = async () => {
    if (users.length === 0) {
      try {
        const user1 = await createUser.mutateAsync({
          name: "李华",
          avatar: "/me.jpeg"
        });
        setUsers(prev => [...prev, user1]);
        setCurrentUser(user1);

        const user2 = await createUser.mutateAsync({
          name: "沈",
          avatar: "/you.jpeg"
        });
        setUsers(prev => [...prev, user1, user2]);
      } catch (error) {
        console.error("创建默认用户失败", error);
      }
    }
  };

  // 切换用户
  const handleSwitchUser = () => {
    if (users.length < 2) return;

    const nextUser = users.find(user => user.id !== currentUser.id);
    if (nextUser) {
      setCurrentUser(nextUser);
    }
  };

  // 使用tRPC钩子获取所有留言
  const { data: messages, isLoading } = api.message.getAll.useQuery(undefined, {
    refetchInterval: 5000, // 每5秒刷新一次数据
  });

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar user={currentUser} onSwitchUser={handleSwitchUser} />

      <div className="flex-1 w-full max-w-2xl mx-auto py-8 px-4">

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