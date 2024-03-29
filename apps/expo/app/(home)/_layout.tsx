import React from "react";
import { Stack } from "expo-router";

export default function Layout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="user/[username]/status"
        options={{
          title: "Tweet",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="user/[username]/index"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create/index"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
