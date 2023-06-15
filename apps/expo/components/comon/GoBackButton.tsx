import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable, Text } from "react-native";

interface GoBackButtonProps {
  showTitle?: boolean;
  title?: string;
  hideIcon?: boolean;
}

export const GoBackButton: React.FunctionComponent<GoBackButtonProps> = ({
  showTitle = false,
  title = "Back",
  hideIcon = false,
}) => {
  const router = useRouter();

  const handleGoBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Pressable onPress={handleGoBack} className="flex-row items-center">
      {!hideIcon && <Ionicons name="chevron-back" size={24} color="black" />}

      {showTitle && <Text className="text-lg font-bold">{title}</Text>}
    </Pressable>
  );
};
