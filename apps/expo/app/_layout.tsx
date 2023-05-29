import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Tabs, Slot, Stack } from "expo-router";
import Constants from "expo-constants";
import { tokenCache } from "../utils/cache";
import { TRPCProvider } from "../utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <SignedIn>
          <SafeAreaProvider>
            {/* <Tabs /> */}
            <StatusBar />
          </SafeAreaProvider>
        </SignedIn>
        <SignedOut>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen
                name="(auth)/login"
                options={{
                  title: "Login",
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </SignedOut>
      </TRPCProvider>
    </ClerkProvider>
  );
}
