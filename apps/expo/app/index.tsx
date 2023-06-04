import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Page() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/tweet" />;
  }

  return <Redirect href="login" />;
}
