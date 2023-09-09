import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import * as React from "react";

interface UnAuthenticatedCheckerProps {
  children: React.ReactNode;
}

const authPaths = ["/login", "/register"];

export const UnAuthenticatedChecker: React.FC<UnAuthenticatedCheckerProps> = ({
  children,
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn && !authPaths.includes(router.pathname)) {
    router.push("/login");
  }

  if (isSignedIn && authPaths.includes(router.pathname)) {
    router.push("/");
  }

  return <>{children}</>;
};
