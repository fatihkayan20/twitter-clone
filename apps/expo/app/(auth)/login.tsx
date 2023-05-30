import { useSignIn } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import * as React from "react";
import { View } from "react-native";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();

  return (
    <View className="flex-1 bg-red-300">
      <Redirect href="/register" />
    </View>
  );
}
