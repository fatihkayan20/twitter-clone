import { EvilIcons } from "@expo/vector-icons";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { useLike } from "@/hooks/tweet/useLike";
import { useShare } from "@/hooks/tweet/useShare";

interface TweetActionsProps {
  isLiked: boolean;
  tweetId: string;
  counts: {
    likes: number;
    subTweets: number;
  };
  hideNumbers?: boolean;
  content: string;
}

export const TweetActions: React.FunctionComponent<TweetActionsProps> = ({
  isLiked: initialIsLiked,
  counts,
  tweetId,
  hideNumbers,
  content,
}) => {
  const { handleLike, isLiked, likeCount } = useLike({
    tweetId,
    isLiked: initialIsLiked,
    likeCount: counts.likes,
  });

  const { handleShareTweet } = useShare(content);

  return (
    <View
      className={`mt-2 flex-row items-center ${
        hideNumbers ? "justify-around" : "justify-between"
      }`}
    >
      <Pressable className="flex-row gap-1">
        <EvilIcons name="comment" size={20} color="gray" />

        {!hideNumbers && (
          <Text className="text-xs text-gray-500">{counts.subTweets}</Text>
        )}
      </Pressable>

      <Pressable className="flex-row gap-1">
        <EvilIcons name="retweet" size={20} color="gray" />

        {!hideNumbers && <Text className="text-xs text-gray-500">{0}</Text>}
      </Pressable>

      <Pressable className="flex-row gap-1" onPress={handleLike}>
        <EvilIcons name="heart" size={20} color={isLiked ? "red" : "gray"} />

        {!hideNumbers && (
          <Text
            className={`text-xs ${isLiked ? "text-red-600" : "text-gray-500"}`}
          >
            {likeCount}
          </Text>
        )}
      </Pressable>

      <Pressable className="flex-row gap-1">
        <EvilIcons name="chart" size={20} color="gray" />

        {!hideNumbers && <Text className="text-xs text-gray-500">{0}</Text>}
      </Pressable>

      <Pressable className="flex-row gap-1" onPress={handleShareTweet}>
        <EvilIcons name="share-apple" size={20} color="gray" />
      </Pressable>
    </View>
  );
};
