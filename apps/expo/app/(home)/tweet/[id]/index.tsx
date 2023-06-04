import { useSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";

interface TweetDetailScreenProps {}

const TweetDetailScreen: React.FunctionComponent<
  TweetDetailScreenProps
> = () => {
  const { id } = useSearchParams();

  return <View></View>;
};

export default TweetDetailScreen;
