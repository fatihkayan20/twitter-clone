import * as React from "react";
import { TextInput, View } from "react-native";
import { Avatar } from "./Avatar";
import { useUser } from "@clerk/clerk-expo";
import { useRouter, useSearchParams } from "expo-router";
import { trpc } from "@/utils/trpc";
import { LoadingButton } from "../button/LoadingButton";

export const RetweetBox: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const utils = trpc.useContext();
  const params = useSearchParams();
  const { id: parentId } = params;

  const [isFocused, setIsFocused] = React.useState(false);
  const [tweet, setTweet] = React.useState("");

  const { mutateAsync: createTweet, isLoading: isCreatingTweet } =
    trpc.tweet.createTweet.useMutation({
      onSuccess: () => {
        setTweet("");
        utils.tweet.getById.invalidate({ id: parentId as string });
        utils.tweet.getSubTweets.invalidate({ id: parentId as string });
      },
    });

  const handleReply = React.useCallback(() => {
    createTweet({ content: tweet, parentId: parentId as string });
  }, [tweet, router]);

  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <>
      <View className={`${isFocused ? "h-28" : "h-16"}`} />
      <View
        className={`absolute bottom-0 right-0 left-0 z-10 border-t  border-gray-400 bg-white py-2 ${
          isFocused ? "" : "h-14"
        }`}
      >
        <View className="flex-row space-x-2 px-3">
          <Avatar url={user?.profileImageUrl} size={30} />
          <TextInput
            className="flex-1  rounded-3xl border border-gray-400 p-2"
            multiline
            placeholder="Tweet your reply"
            value={tweet}
            onChangeText={setTweet}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>

        {isFocused && (
          <LoadingButton
            className="mt-2 self-end rounded-full bg-blue-500 px-3 py-1.5"
            labelClassName="font-bold text-white "
            label="Reply"
            onPress={handleReply}
            isLoading={isCreatingTweet}
          />
        )}
      </View>
    </>
  );
};
