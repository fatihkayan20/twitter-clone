// src/pages/_app.tsx
import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { UnAuthenticatedChecker } from "../components/common/UnAuthenticatedChecker";
import { MainLayout } from "@/components/layout/MainLayout";
import { NextPageWithLayout } from "@/types/NextPageWithLayout";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout): React.ReactElement => {
  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <MainLayout>{page}</MainLayout>);

  return (
    <ClerkProvider {...pageProps}>
      <UnAuthenticatedChecker>
        {getLayout(<Component {...pageProps} />)}
      </UnAuthenticatedChecker>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
