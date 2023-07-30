import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export const useProtect = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (isLoaded && !isSignedIn) {
    router.push("/(auth)/login");
  }
};
