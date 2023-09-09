import { useRouter } from "next/router";
import * as React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface BackButtonProps {
  title: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ title }) => {
  const router = useRouter();

  const handleGoBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <button
        onClick={handleGoBack}
        className="fixed top-0 left-20 flex w-full items-center space-x-10  p-3"
      >
        <AiOutlineArrowLeft size={20} className=" text-black dark:text-white" />
        <span className="text-2xl font-semibold text-black dark:text-white">
          {title}
        </span>
      </button>

      <div className="h-14" />
    </>
  );
};
