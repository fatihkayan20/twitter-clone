import * as React from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { CreateTweetButton } from "@/components/button/CreateTweetButton";
import { trpc } from "@/utils/trpc";
import { TweetCard } from "@/components/tweet/TweetCard";

export default function Page() {
  const {
    isLoading,
    isFetching,
    data: tweets,
    refetch: refetchTweets,
    fetchNextPage,
  } = trpc.tweet.all.useInfiniteQuery(
    {
      limit: 15,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const allTweets = React.useMemo(() => {
    return tweets?.pages.flatMap((page) => page.items);
  }, [tweets]);

  if (isLoading) {
    return (
      <View className="flex-1 p-3">
        <ActivityIndicator animating={isLoading} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlashList
        data={allTweets}
        keyExtractor={(tweet) => tweet.id}
        renderItem={({ item: tweet }) => <TweetCard tweet={tweet} />}
        estimatedItemSize={500}
        ItemSeparatorComponent={() => <View className="h-[.2px] bg-gray-500" />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetchTweets} />
        }
        onEndReached={fetchNextPage}
        ListFooterComponent={<ActivityIndicator animating={isFetching} />}
      />

      <CreateTweetButton />
    </View>
  );
}
