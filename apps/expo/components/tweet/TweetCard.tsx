import { RouterOutput } from "@acme/api";
import * as React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { TweetActions } from "./TweetActions";
import { useRouter } from "expo-router";
import { Avatar } from "./Avatar";

interface TweetCardProps {
  tweet: RouterOutput["tweet"]["all"]["items"][number];
}

export const TweetCard: React.FunctionComponent<TweetCardProps> = ({
  tweet,
}) => {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const handleNavigateToTweetDetail = React.useCallback(() => {
    router.push(`/(home)/tweet/${tweet.id}`);
  }, [tweet.id, router]);

  return (
    <Pressable
      onPress={handleNavigateToTweetDetail}
      className="flex flex-row space-x-2 py-2 px-1"
    >
      <Avatar url={tweet.user?.profilePicture} />

      <View className="flex-1">
        <View className="flex flex-row space-x-1">
          <Text className="font-bold">{tweet.user?.name}</Text>
          <Text className="text-xs text-gray-600">@{tweet.user?.username}</Text>
          <Text className="text-xs text-gray-600">
            •{formatDistanceToNow(tweet.createdAt)}
          </Text>
        </View>

        <Text className="mt-1.5 w-full flex-wrap text-sm">{tweet.content}</Text>
        <TweetActions
          isLiked={tweet.isLiked}
          tweetId={tweet.id}
          counts={{
            likes: tweet._count.likes,
            subTweets: tweet._count.subTweets,
          }}
        />
      </View>
    </Pressable>
  );
};
