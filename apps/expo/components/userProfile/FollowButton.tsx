import { useFollow } from "@/hooks/userProfile/useFollow";
import { trpc } from "@/utils/trpc";
import { RouterOutput } from "@acme/api";
import { useAuth } from "@clerk/clerk-expo";
import * as React from "react";
import { Pressable, Text } from "react-native";

interface FollowButtonProps {
  user: RouterOutput["user"]["getByUsername"];
}

export const FollowButton: React.FunctionComponent<FollowButtonProps> = ({
  user,
}) => {
  const { userId, isLoaded } = useAuth();

  console.log(user);

  const { isFollowed, toggleFollow } = useFollow({
    isFollowed: user.isFollowed,
    userId: user.id,
    username: user.username,
  });

  if (isLoaded && userId === user.id) return null;

  return (
    <Pressable
      className={`rounded-full border   px-6 py-1 ${
        isFollowed ? "border-white bg-black" : "border-black bg-white"
      }`}
      onPress={toggleFollow}
    >
      {isFollowed ? (
        <Text className={`text-md font-bold text-white `}>Following</Text>
      ) : (
        <Text className="text-md font-bold text-black ">Follow</Text>
      )}
    </Pressable>
  );
};
