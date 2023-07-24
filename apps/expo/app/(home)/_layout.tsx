import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
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
