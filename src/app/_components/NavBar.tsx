"use client";

import { type FC } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface NavBarProps {
  user: User;
  onSwitchUser: () => void;
}

const NavBar: FC<NavBarProps> = ({ user, onSwitchUser }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">沈说</div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchUser}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            切换用户
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm">{user.name}</span>
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
        </div>
      </div>
    </header>
  );
};

export default NavBar; 