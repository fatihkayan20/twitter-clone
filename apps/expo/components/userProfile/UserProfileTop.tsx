import { RouterOutput } from "@acme/api";
import * as React from "react";
import { Text, View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import Animated, { SharedValue } from "react-native-reanimated";
import { UserProfileAvatar } from "./UserProfileAvatar";
import { FollowButton } from "./FollowButton";

interface UserProfileTopProps {
  user: RouterOutput["user"]["getByUsername"];
  scrollY: SharedValue<number>;
}

export const UserProfileTop: React.FC<UserProfileTopProps> = ({
  user,
  scrollY,
}) => {
  return (
    <View className="mb-7 px-4">
      <View className="flex-row items-end justify-between">
        <Animated.View>
          <UserProfileAvatar url={user.profilePicture} scrollY={scrollY} />
        </Animated.View>
        <FollowButton user={user} />
      </View>

      <View>
        <Text className="text-xl font-bold">{user.name}</Text>
        <Text className="text-gray-500">@{user.username}</Text>
      </View>

      <View className="my-4">
        {/* TODO: add bio to user profile */}
        <Text>
          {
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.   Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
          }
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-1">
          <EvilIcons name="location" size={24} color="black" />
          {/* TODO: add location to user profile */}
          <Text>{"Earth"}</Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <EvilIcons name="calendar" size={24} color="black" />
          <Text>Joined {format(new Date(user.createdAt), "MMM yyyy")}</Text>
        </View>
      </View>
    </View>
  );
};
