import * as React from "react";
import { Text, View } from "react-native";
import { Avatar } from "./Avatar";
import { RouterOutput } from "@/../../packages/api";
import { format } from "date-fns";
import { TweetActions } from "./TweetActions";
import { Ionicons } from "@expo/vector-icons";

interface MainTweetProps {
  tweet: RouterOutput["tweet"]["getById"];
}

export const MainTweet: React.FC<MainTweetProps> = ({ tweet }) => {
  return (
    <View className="p-2">
      <View className="flex-row items-center">
        <Avatar url={tweet?.user?.profilePicture} />

        <View className=" ml-3 flex-1 ">
          <Text className="text-base font-bold">{tweet?.user?.name}</Text>
          <Text className="text-gray-500">@{tweet?.user?.username}</Text>
        </View>

        <Ionicons
          name="ellipsis-horizontal"
          size={24}
          color="black"
          className="h-full"
        />
      </View>

      <Text className="mt-3 ">{tweet?.content}</Text>

      <Text className="mt-3 text-xs text-gray-500">
        {format(new Date(tweet?.createdAt ?? ""), "h:mm · dd.mm.yyy")}
        <Text className="px-2 font-bold text-black">
          {/* TODO: {tweet?._count.views} */} {Math.floor(Math.random() * 100)}{" "}
        </Text>
        Views
      </Text>

      <View className="-ml-3 mt-2 h-[1px] w-[200%] bg-gray-400" />

      <View className="mt-3 flex-row items-center">
        <Text className="text-gray-500">
          <Text className="font-bold text-black">
            {tweet?._count.subTweets}
          </Text>{" "}
          Retweets
        </Text>

        <Text className="ml-2 text-gray-500">
          <Text className="font-bold text-black">{tweet?._count.likes}</Text>{" "}
          Likes
        </Text>
      </View>
      <View className="-ml-3 mt-2 h-[1px] w-[200%] bg-gray-400" />

      <TweetActions
        counts={tweet._count}
        isLiked={tweet.isLiked}
        tweetId={tweet.id}
        hideNumbers
      />

      <View className="my-2 -ml-3  h-[1px] w-[200%] bg-gray-400" />
    </View>
  );
};
