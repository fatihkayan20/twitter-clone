import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as React from "react";
import { Pressable } from "react-native";

export const CreateTweetButton: React.FC = () => {
  const router = useRouter();

  const handlePress = (): void => {
    router.push("/(home)/create");
  };

  return (
    <Pressable
      onPress={handlePress}
      className="absolute bottom-1 right-1 z-50 h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg"
    >
      <Ionicons name="add" size={25} color="white" />
    </Pressable>
  );
};
