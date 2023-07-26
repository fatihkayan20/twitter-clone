import * as React from "react";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { trpc } from "@/utils/trpc";
import { NotificationCard } from "@/components/notification/NotificationCard";
import { useFocusEffect } from "expo-router";

export default function Page() {
  const { isLoading, data: notifications } = trpc.notification.all.useQuery();
  const utils = trpc.useContext();

  useFocusEffect(
    React.useCallback(() => {
      utils.notification.all.invalidate();
    }, []),
  );

  if (isLoading) {
    return (
      <View className="flex-1 p-3">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlashList
        data={notifications}
        keyExtractor={(notification) => notification.id}
        renderItem={({ item: notification }) => (
          <NotificationCard notification={notification} />
        )}
        estimatedItemSize={20}
        ItemSeparatorComponent={() => <View className="h-[.2px] bg-gray-500" />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No notifications</Text>
          </View>
        )}
      />
    </View>
  );
}
