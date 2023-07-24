import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Tabs, Stack } from "expo-router";
import Constants from "expo-constants";
import { tokenCache } from "../utils/cache";
import { TRPCProvider } from "../utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
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
      <TRPCProvider>
        <ThemeProvider value={theme}>
          <SignedIn>
            <SafeAreaProvider>
              <Tabs>
                <Tabs.Screen
                  name="(home)"
                  options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                      <AntDesign
                        name="home"
                        color={focused ? "#000" : "rgba(136, 153, 166, .7)"}
                        size={24}
                      />
                    ),
                    tabBarShowLabel: false,
                  }}
                />

                <Tabs.Screen
                  name="notification"
                  options={{
                    title: "Notifications",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                      <Ionicons
                        name="notifications-outline"
                        color={focused ? "#000" : "rgba(136, 153, 166, .7)"}
                        size={24}
                      />
                    ),
                    tabBarShowLabel: false,
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
        </ThemeProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
