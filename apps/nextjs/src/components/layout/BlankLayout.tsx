import * as React from "react";

interface BlankLayoutProps {
  children: React.ReactNode;
}

export const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen dark:bg-black dark:text-white">
      {children}
    </div>
  );
};
