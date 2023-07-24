import * as React from "react";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { trpc } from "@/utils/trpc";
import { NotificationCard } from "@/components/notification/NotificationCard";

export default function Page() {
  const { isLoading, data: notifications } = trpc.notification.all.useQuery();

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
      />
    </View>
  );
}
