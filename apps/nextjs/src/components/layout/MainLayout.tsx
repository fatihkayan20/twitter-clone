import * as React from "react";
import { LeftSidebar } from "./LeftSidebar";
import { NotificationListener } from "../common/NotificationListener";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen dark:bg-black dark:text-white">
      <NotificationListener>
        <LeftSidebar />
        <div className=" ml-20 flex-1">{children}</div>
      </NotificationListener>
    </div>
  );
};
