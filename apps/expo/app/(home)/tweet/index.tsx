import * as React from "react";
import { Text, View } from "react-native";
import { trpc } from "../../../utils/trpc";
import { TweetCard } from "../../../components/tweet/TweetCard";
import { FlashList } from "@shopify/flash-list";
import { CreateTweetButton } from "@/components/button/CreateTweetButton";

export default function Page() {
  const { isLoading, data: tweets } = trpc.tweet.all.useQuery();

  if (isLoading) {
    return (
      <View className="flex-1 p-3">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlashList
        data={tweets}
        keyExtractor={(tweet) => tweet.id}
        renderItem={({ item: tweet }) => <TweetCard tweet={tweet} />}
        estimatedItemSize={20}
        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-500" />}
      />

      <CreateTweetButton />
    </View>
  );
}
