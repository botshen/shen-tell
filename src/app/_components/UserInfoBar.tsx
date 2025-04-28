"use client";

import { type FC } from "react";
import Image from "next/image";

interface UserInfoBarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

const UserInfoBar: FC<UserInfoBarProps> = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm font-medium text-gray-700">{user.name}</div>
      <div className="relative h-8 w-8 overflow-hidden rounded-full">
        <Image
          src={user.avatar}
          alt={user.name}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default UserInfoBar; 