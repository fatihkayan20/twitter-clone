import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Tabs, Stack } from "expo-router";
import Constants from "expo-constants";
import { tokenCache } from "../utils/cache";
import { TRPCProvider } from "../utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, StatusBar, Text } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

const unwantedRoutes = ["(auth)/login", "(auth)/register"];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

export default function Layout() {
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
                      <Ionicons
                        name="notifications-outline"
                        color={focused ? "#000" : "rgba(136, 153, 166, .7)"}
                        size={24}
                      />
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
