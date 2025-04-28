"use client";

import { type FC, useState } from "react";
import Image from "next/image";

interface UserInfoBarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onSwitchUser: () => void;
}

const UserInfoBar: FC<UserInfoBarProps> = ({ user, onSwitchUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleDropdown}
      >
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

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
          <button
            onClick={() => {
              onSwitchUser();
              setIsDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            切换用户
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfoBar; 