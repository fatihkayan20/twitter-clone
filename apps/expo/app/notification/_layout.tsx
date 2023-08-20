import React from "react";
import { Stack } from "expo-router";

export default function NotificationLayout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Notifications",
        }}
      />
    </Stack>
  );
}
