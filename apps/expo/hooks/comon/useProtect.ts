import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export const useProtect = (): void => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  if (isLoaded && !isSignedIn) {
    setTimeout(() => {
      router.push("/(auth)/login");
    }, 200);
  }
};
