import React from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Tabs, Stack } from "expo-router";
import Constants from "expo-constants";
import { tokenCache } from "../utils/cache";
import { TRPCProvider } from "../utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { NotificationListener } from "@/components/notification/NotificationListener";
import { NotificationTabIcon } from "@/components/notification/NotificationTabIcon";

const unwantedRoutes = ["(auth)/login", "(auth)/register"];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

export default function Layout(): JSX.Element {
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar />
      <SafeAreaProvider>
        <TRPCProvider>
          <ThemeProvider value={theme}>
            <SignedIn>
              <NotificationListener>
                <Tabs
                  screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                  }}
                >
                  <Tabs.Screen
                    name="(home)"
                    options={{
                      title: "Home",
                      tabBarIcon: ({ focused }) => (
                        <AntDesign
                          name="home"
                          color={focused ? "#000" : "rgba(136, 153, 166, .7)"}
                          size={24}
                        />
                      ),
                    }}
                  />

                  <Tabs.Screen
                    name="notification"
                    options={{
                      title: "Notifications",
                      tabBarIcon: ({ focused }) => (
                        <NotificationTabIcon focused={focused} />
                      ),
                    }}
                  />

                  {unwantedRoutes.map((route) => (
                    <Tabs.Screen
                      key={route}
                      name={route}
                      options={{
                        href: null,
                      }}
                    />
                  ))}
                </Tabs>
              </NotificationListener>
            </SignedIn>
            <SignedOut>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName="(auth)/login"
              >
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
            </SignedOut>
          </ThemeProvider>
        </TRPCProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
