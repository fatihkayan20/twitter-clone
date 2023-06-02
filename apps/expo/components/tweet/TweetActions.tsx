import { EvilIcons } from "@expo/vector-icons";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { useLike } from "../../app/hooks/tweet/useLike";
import { Like } from ".prisma/client";

interface TweetActionsProps {
  likes: Like[];
  tweetId: string;
}

export const TweetActions: React.FunctionComponent<TweetActionsProps> = ({
  likes,
  tweetId,
}) => {
  const { handleLike, isLiked, likeCount } = useLike({
    tweetId,
    likes,
  });

  return (
    <View className="mt-2 flex-row items-center justify-between">
      <Pressable className="flex-row gap-1">
        <EvilIcons name="comment" size={20} color="gray" />

        <Text className="text-xs text-gray-500">{0}</Text>
      </Pressable>

      <Pressable className="flex-row gap-1">
        <EvilIcons name="retweet" size={20} color="gray" />
        <Text className="text-xs text-gray-500">{0}</Text>
      </Pressable>

      <Pressable className="flex-row gap-1" onPress={handleLike}>
        <EvilIcons name="heart" size={20} color={isLiked ? "red" : "gray"} />
        <Text
          className={`text-xs ${isLiked ? "text-red-600" : "text-gray-500"}`}
        >
          {likeCount}
        </Text>
      </Pressable>

      <Pressable className="flex-row gap-1">
        <EvilIcons name="chart" size={20} color="gray" />
        <Text className="text-xs text-gray-500">{0}</Text>
      </Pressable>

      <Pressable className="flex-row gap-1">
        <EvilIcons name="share-apple" size={20} color="gray" />
      </Pressable>
    </View>
  );
};