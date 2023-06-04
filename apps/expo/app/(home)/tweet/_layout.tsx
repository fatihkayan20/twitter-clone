import { GoBackButton } from "@/components/comon/GoBackButton";
import { Stack } from "expo-router";

export default function TweetLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

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
