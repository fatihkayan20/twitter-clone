import { CreateTweetButton } from "@/components/button/CreateTweetButton";
import { TweetCard } from "@/components/tweet/TweetCard";
import { ITab } from "@/types/ITab";
import { trpc } from "@/utils/trpc";
import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

interface TweetListProps {
  tab: ITab;
}

export const TweetList: React.FunctionComponent<TweetListProps> = ({ tab }) => {
  const {
    isLoading,
    isFetching,
    data: tweets,
    refetch: refetchTweets,
    fetchNextPage,
  } = trpc.tweet.all.useInfiniteQuery(
    {
      limit: 15,
      isFollowingOnly: tab === ITab.Following,
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
        onEndReachedThreshold={0.7}
        ListFooterComponent={
          (allTweets?.length ?? 0) > 14 ? (
            <ActivityIndicator animating={isFetching} />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      <CreateTweetButton />
    </View>
  );
};
