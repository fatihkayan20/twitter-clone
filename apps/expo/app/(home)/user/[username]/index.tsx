import * as React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { CreateTweetButton } from "@/components/button/CreateTweetButton";
import { trpc } from "@/utils/trpc";
import { TweetCard } from "@/components/tweet/TweetCard";
import { useSearchParams } from "expo-router";
import { UserProfileTop } from "@/components/userProfile/UserProfileTop";
import { useScroll } from "@/hooks/userProfile/useScroll";
import Animated from "react-native-reanimated";
import { UserProfileCustomHeader } from "@/components/userProfile/UserProfileCustomHeader";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function Page(): JSX.Element {
  const { username } = useSearchParams();
  const { scrollY, handleScroll } = useScroll();

  const { data: userData, refetch: refetchUserData } =
    trpc.user.getByUsername.useQuery({
      username: username as string,
    });

  const {
    isLoading,
    isFetching,
    data: tweets = { pages: [] },
    refetch: refetchTweets,
    fetchNextPage,
  } = trpc.tweet.userTweets.useInfiniteQuery(
    {
      username: username as string,
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

  if (!userData) {
    return (
      <View className="flex-1 p-3">
        <Text>User not found</Text>
      </View>
    );
  }

  const handleRefresh = (): void => {
    refetchUserData();
    refetchTweets();
  };

  return (
    <SafeAreaView className="flex-1">
      <UserProfileCustomHeader
        scrollY={scrollY}
        name={userData.name ?? ""}
        tweetCount={userData.tweetCount}
      />
      <AnimatedFlashList
        data={allTweets ?? []}
        keyExtractor={(tweet) => (tweet as (typeof allTweets)[number]).id}
        renderItem={({ item: tweet }) => (
          <TweetCard tweet={tweet as (typeof allTweets)[number]} />
        )}
        estimatedItemSize={500}
        ItemSeparatorComponent={() => <View className="h-[.2px] bg-gray-500" />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        onEndReached={fetchNextPage}
        ListFooterComponent={<ActivityIndicator animating={isFetching} />}
        ListHeaderComponent={
          <UserProfileTop user={userData} scrollY={scrollY} />
        }
        onScroll={handleScroll}
      />

      <CreateTweetButton />
    </SafeAreaView>
  );
}
