// src/pages/_app.tsx
import * as React from "react";
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { LeftSidebar } from "../components/layout/LeftSidebar";
import { UnAuthenticatedChecker } from "../components/common/UnAuthenticatedChecker";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <div className="flex min-h-screen dark:bg-black dark:text-white">
        <UnAuthenticatedChecker>
          <LeftSidebar />
          <div className=" ml-20 flex-1">
            <Component {...pageProps} />
          </div>
        </UnAuthenticatedChecker>
      </div>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
