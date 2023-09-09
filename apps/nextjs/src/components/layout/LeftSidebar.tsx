import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import {
  AiFillBell,
  AiFillHome,
  AiOutlineBell,
  AiOutlineHome,
} from "react-icons/ai";

const menuItems = [
  {
    label: "Home",
    passiveIcon: AiOutlineHome,
    activeIcon: AiFillHome,
    href: "/",
    exact: true,
  },
  {
    label: "Notifications",
    passiveIcon: AiOutlineBell,
    activeIcon: AiFillBell,
    href: "/notifications",
  },
];

export const LeftSidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 flex h-screen w-20 flex-col items-center border-r ">
      <div>
        <Image src="/logo.jpg" width={50} height={50} alt="logo" />
      </div>

      {menuItems.map((item, index) => {
        const isActive = item.exact
          ? router.pathname === item.href
          : router.pathname.includes(item.href);
        const Icon = isActive ? item.activeIcon : item.passiveIcon;

        return (
          <button
            key={index}
            className="mt-10 flex  w-full items-center justify-center "
            onClick={() => router.push(item.href)}
          >
            <Icon className="text-2xl text-gray-600 dark:text-gray-100" />
            <div className="hidden text-xs text-gray-600">{item.label}</div>
          </button>
        );
      })}
    </div>
  );
};
