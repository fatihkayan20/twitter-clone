import * as React from "react";
import { Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GoBackButton } from "@/components/comon/GoBackButton";
import { useUser } from "@clerk/clerk-expo";
import { Avatar } from "@/components/tweet/Avatar";
import { trpc } from "@/utils/trpc";
import { useRouter } from "expo-router";
import { LoadingButton } from "@/components/button/LoadingButton";

const CreateTweet: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const utils = trpc.useContext();

  const { mutateAsync: createTweet, isLoading: isCreating } =
    trpc.tweet.createTweet.useMutation({
      onSuccess: (data) => {
        utils.tweet.all.invalidate();
        router.replace("../");

        router.push(`/(home)/user/${data.user?.username}/status/${data.id}`);
      },
    });

  const [tweet, setTweet] = React.useState("");

  const isDisabledTweetButton = tweet.length === 0;

  const handleTweet = React.useCallback(() => {
    createTweet({ content: tweet });
  }, [tweet, router]);

  return (
    <View>
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between p-3">
        <GoBackButton showTitle title="Create Tweet" />
        <LoadingButton
          label="Tweet"
          labelClassName="font-bold text-white"
          isLoading={isCreating}
          onPress={handleTweet}
          className={`rounded-full bg-blue-500 px-3 py-2 ${
            isDisabledTweetButton && " opacity-50"
          }`}
        />
      </View>

      <View className="flex-row space-x-3 p-2">
        <Avatar url={user?.profileImageUrl} size={30} />
        <TextInput
          className="flex-1 "
          multiline
          placeholder="What's happening?"
          value={tweet}
          onChangeText={setTweet}
          autoFocus
        />
      </View>
    </View>
  );
};

export default CreateTweet;
