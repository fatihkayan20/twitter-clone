import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Text, View } from "react-native";
import { useNotificationContext } from "./NotificationListener";

interface NotificationTabIconProps {
  focused: boolean;
}

export const NotificationTabIcon: React.FC<NotificationTabIconProps> = ({
  focused,
}) => {
  const { notificationCount } = useNotificationContext();

  return (
    <View>
      <Ionicons
        name="notifications-outline"
        color={focused ? "#000" : "rgba(136, 153, 166, .7)"}
        size={24}
      />

      {notificationCount > 0 && (
        <View className="absolute top-0 right-0 -mt-2 -mr-2 min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-black/30 p-[2px]">
          <Text className="text-xs text-black">{notificationCount}</Text>
        </View>
      )}
    </View>
  );
};
