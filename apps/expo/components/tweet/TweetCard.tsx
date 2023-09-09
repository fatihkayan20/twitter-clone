import { RouterOutput } from "@acme/api";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
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
  const router = useRouter();

  const handleNavigateToTweetDetail = React.useCallback(() => {
    router.push(`/(home)/user/${tweet.user?.username}/status/${tweet.id}`);
  }, [tweet.id, tweet.user?.username, router]);

  const handleNavigateToUserProfile = React.useCallback(() => {
    router.push(`/(home)/user/${tweet.user?.username}`);
  }, [tweet.user?.username, router]);

  return (
    <Pressable
      onPress={handleNavigateToTweetDetail}
      className="flex flex-row space-x-2 py-2 px-2"
    >
      <Pressable onPress={handleNavigateToUserProfile}>
        <Avatar url={tweet.user?.profilePicture} />
      </Pressable>

      <View className="flex-1">
        <Pressable
          onPress={handleNavigateToUserProfile}
          className="flex flex-row space-x-1"
        >
          <Text className="font-bold">{tweet.user?.name}</Text>
          <Text className="text-xs text-gray-600">@{tweet.user?.username}</Text>
          <Text className="text-xs text-gray-600">
            •{formatDistanceToNow(tweet.createdAt)}
          </Text>
        </Pressable>

        <Text className="mt-1.5 w-full flex-wrap text-sm">{tweet.content}</Text>
        <TweetActions
          isLiked={tweet.isLiked}
          tweetId={tweet.id}
          counts={{
            likes: tweet._count.likes,
            subTweets: tweet._count.subTweets,
          }}
          content={tweet.content ?? ""}
        />
      </View>
    </Pressable>
  );
};
