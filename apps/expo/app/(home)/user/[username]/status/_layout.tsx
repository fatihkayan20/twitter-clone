import React from "react";
import { Stack } from "expo-router";
import { GoBackButton } from "@/components/common/GoBackButton";

export default function TweetLayout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name="[id]/index"
        options={{
          title: "Thread",
          headerBackTitleVisible: false,
          headerLeft() {
            return <GoBackButton />;
          },
        }}
      />
    </Stack>
  );
}
