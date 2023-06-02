import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Tabs, Stack } from "expo-router";
import Constants from "expo-constants";
import { tokenCache } from "../utils/cache";
import { TRPCProvider } from "../utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <SignedIn>
          <SafeAreaProvider>
            <Tabs>
              <Tabs.Screen
                name="(home)/tweets"
                options={{
                  title: "Home",
                  tabBarIcon: ({ focused }) => (
                    <AntDesign
                      name="home"
                      color={focused ? "#000" : "#333"}
                      size={24}
                    />
                  ),
                  tabBarShowLabel: false,
                }}
              />

              <Tabs.Screen
                name="(auth)/login"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="(auth)/register"
                options={{
                  href: null,
                }}
              />
              <Tabs.Screen
                name="index"
                options={{
                  href: null,
                }}
              />
            </Tabs>
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
              <Stack.Screen
                name="(auth)/register"
                options={{
                  title: "Register",
                }}
              />
            </Stack>
          </SafeAreaProvider>
        </SignedOut>
      </TRPCProvider>
    </ClerkProvider>
  );
}
