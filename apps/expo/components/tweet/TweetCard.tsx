import { RouterOutput } from "@acme/api";
import * as React from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";
import { formatDistanceToNow } from "date-fns";

interface TweetCardProps {
  tweet: RouterOutput["tweet"]["all"][number];
}

export const TweetCard: React.FunctionComponent<TweetCardProps> = ({
  tweet,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View className="flex flex-row gap-2  p-3 ">
      <Image
        source={{ uri: tweet.user?.profilePicture ?? "" }}
        className="h-10 w-10 rounded-full"
      />

      <View
        className="flex-wrap "
        style={{
          width: width - 70,
        }}
      >
        <View className="flex flex-row gap-1">
          <Text className="font-bold">{tweet.user?.name}</Text>
          <Text className="text-xs text-gray-600">@{tweet.user?.username}</Text>
          <Text className="text-xs text-gray-600">
            •{formatDistanceToNow(tweet.createdAt)}
          </Text>
        </View>

        <Text className="mt-2 w-full flex-wrap text-sm">{tweet.content}</Text>
      </View>
    </View>
  );
};
