import { useFollow } from "@/hooks/userProfile/useFollow";
import { RouterOutput } from "@acme/api";
import { useAuth } from "@clerk/nextjs";
import * as React from "react";

interface FollowButtonProps {
  user: RouterOutput["user"]["getByUsername"];
}

export const FollowButton: React.FC<FollowButtonProps> = ({ user }) => {
  const { userId, isLoaded } = useAuth();

  const { isFollowed, toggleFollow } = useFollow({
    isFollowed: user.isFollowed,
    userId: user.id,
    username: user.username,
  });

  if (isLoaded && userId === user.id) return null;

  return (
    <button
      className={`rounded-full border   px-6 py-1 ${
        isFollowed
          ? "border-white bg-black dark:border-black dark:bg-white"
          : "border-black bg-white dark:border-white dark:bg-black"
      }`}
      onClick={toggleFollow}
    >
      {isFollowed ? (
        <span className={`text-md font-bold text-black  `}>Following</span>
      ) : (
        <span className="text-md font-bold text-white  ">Follow</span>
      )}
    </button>
  );
};
