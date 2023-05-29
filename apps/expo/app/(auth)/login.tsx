import { usePathname, useRouter } from "expo-router";
import * as React from "react";
import { Text, View } from "react-native";

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();

  console.log(pathName);

  return (
    <View className="flex-1 bg-red-300">
      <Text>Hello Worldd</Text>
      {/* <View style={styles.main}>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      </View> */}
    </View>
  );
}
