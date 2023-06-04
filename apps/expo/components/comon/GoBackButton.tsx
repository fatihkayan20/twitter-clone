import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Text } from "react-native";

interface GoBackButtonProps {
  showTitle?: boolean;
  title?: string;
}

export const GoBackButton: React.FunctionComponent<GoBackButtonProps> = ({
  showTitle = false,
  title = "Back",
}) => {
  const router = useRouter();

  const handleGoBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <>
      <Ionicons
        name="chevron-back"
        size={24}
        color="black"
        onPress={handleGoBack}
      />

      {showTitle && <Text className="text-lg font-bold">{title}</Text>}
    </>
  );
};
