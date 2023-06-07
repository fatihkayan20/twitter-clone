import { RouterOutput } from "@/../../packages/api";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { NotificationTypeIcon } from "./NotificationTypeIcon";
import { Avatar } from "../tweet/Avatar";
import { getNotificationText } from "@/utils/notification";
import { useRouter } from "expo-router";

interface NotificationCardProps {
  notification: RouterOutput["notification"]["all"][number];
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const router = useRouter();

  const handleNavigateDetail = () => {
    router.push(`/tweet/${notification.tweetId}`);
  };

  return (
    <Pressable className="flex-row" onPress={handleNavigateDetail}>
      <NotificationTypeIcon notificationType={notification.type} />
      <View className="ml-2">
        <Avatar url={notification.sender?.profilePicture} />
        <Text className="my-1">
          <Text className="font-bold">{notification.sender?.name} </Text>
          {getNotificationText(notification)}
        </Text>

        <Text className=" text-gray-500">{notification.tweet?.content}</Text>
      </View>
    </Pressable>
  );
};
