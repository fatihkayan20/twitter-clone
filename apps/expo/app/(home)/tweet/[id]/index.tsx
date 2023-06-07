import { MainTweet } from "@/components/tweet/MainTweet";
import { TweetCard } from "@/components/tweet/TweetCard";
import { trpc } from "@/utils/trpc";
import { FlashList } from "@shopify/flash-list";
import { useSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

interface TweetDetailScreenProps {}

const TweetDetailScreen: React.FunctionComponent<
  TweetDetailScreenProps
> = () => {
  const { id } = useSearchParams();

  const { data: tweetDetail, isLoading: isDetailLoading } =
    trpc.tweet.getById.useQuery(
      {
        id: id as string,
      },
      {
        enabled: !!id,
      },
    );

  if (isDetailLoading || !tweetDetail) {
    return null;
  }

  return (
    <View className="flex-1">
      <FlashList
        data={tweetDetail.subTweets}
        ListHeaderComponent={<MainTweet tweet={tweetDetail} />}
        keyExtractor={(tweet) => tweet.id}
        renderItem={({ item: tweet }) => <TweetCard tweet={tweet} />}
        estimatedItemSize={20}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-500" />}
      />
    </View>
  );
};

export default TweetDetailScreen;
