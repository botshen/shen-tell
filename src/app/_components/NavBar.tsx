"use client";

import { type FC } from "react";
import UserInfoBar from "./UserInfoBar";

interface NavBarProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

const NavBar: FC<NavBarProps> = ({ user }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-gray-800">沈的留言板</h1>
          </div>
          <div>
            <UserInfoBar user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 