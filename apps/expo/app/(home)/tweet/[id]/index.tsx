import { MainTweet } from "@/components/tweet/MainTweet";
import { RetweetBox } from "@/components/tweet/RetweetBox";
import { TweetCard } from "@/components/tweet/TweetCard";
import { trpc } from "@/utils/trpc";
import { FlashList } from "@shopify/flash-list";
import { useSearchParams } from "expo-router";
import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";

const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 0;

const TweetDetailScreen: React.FunctionComponent = () => {
  const { id } = useSearchParams();

  const {
    data: tweetDetail,
    isLoading: isDetailLoading,
    refetch: refetchTweetDetail,
  } = trpc.tweet.getById.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    },
  );

  const {
    data: subTweetList,
    isLoading: isSubTweetsLoading,
    fetchNextPage: fetchMoreSubTweets,
    refetch: refetchSubTweets,
    isFetching: isMoreSubTweetsLoading,
  } = trpc.tweet.getSubTweets.useInfiniteQuery(
    {
      limit: 15,
      id: id as string,
    },
    {
      enabled: !!id,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const refetchData = React.useCallback(() => {
    refetchTweetDetail();
    refetchSubTweets();
  }, [refetchTweetDetail, refetchSubTweets]);

  const subTweets = React.useMemo(() => {
    return subTweetList?.pages?.flatMap((page) => page.items) ?? [];
  }, [subTweetList]);

  if (isDetailLoading || isSubTweetsLoading) {
    return <ActivityIndicator animating={isDetailLoading} />;
  }

  if (!tweetDetail) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-black">Tweet not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View className="flex-1 ">
        <FlashList
          data={subTweets}
          ListEmptyComponent={
            <View className=" flex-1 items-center justify-center ">
              <Text className="text-black">No replies</Text>
            </View>
          }
          ListHeaderComponent={<MainTweet tweet={tweetDetail} />}
          keyExtractor={(tweet) => tweet.id}
          renderItem={({ item: tweet }) => <TweetCard tweet={tweet} />}
          estimatedItemSize={500}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-gray-500" />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isDetailLoading || isSubTweetsLoading}
              onRefresh={refetchData}
            />
          }
          onEndReached={fetchMoreSubTweets}
          ListFooterComponent={
            <ActivityIndicator animating={isMoreSubTweetsLoading} />
          }
        />

        <RetweetBox />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TweetDetailScreen;
