import { RouterOutput } from "@acme/api";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "../tweet/Avatar";
import { EvilIcons } from "@expo/vector-icons";
import { format } from "date-fns";

interface UserProfileTopProps {
  user: RouterOutput["user"]["getByUsername"];
}

export const UserProfileTop: React.FC<UserProfileTopProps> = ({ user }) => {
  return (
    <View className="mb-7 px-4">
      <View className="flex-row items-end justify-between">
        <Avatar url={user.profilePicture} size={100} />

        <Pressable className="rounded-full border bg-black  px-6 py-1 dark:bg-white">
          <Text className="text-md font-bold text-white dark:text-black">
            Follow
          </Text>
        </Pressable>
      </View>

      <View>
        <Text className="text-xl font-bold">{user.name}</Text>
        <Text className="text-gray-500">@{user.username}</Text>
      </View>

      <View className="my-4">
        <Text>
          {user.bio ??
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.   Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-1">
          <EvilIcons name="location" size={24} color="black" />
          <Text>{user.location ?? "Earth"}</Text>
        </View>

        <View className="flex-row items-center space-x-1">
          <EvilIcons name="calendar" size={24} color="black" />
          <Text>Joined {format(new Date(user.createdAt), "MMM yyyy")}</Text>
        </View>
      </View>
    </View>
  );
};
