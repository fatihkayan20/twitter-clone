import * as React from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GoBackButton } from "../common/GoBackButton";
import { Ionicons } from "@expo/vector-icons";

interface UserProfileCustomHeaderProps {
  scrollY: SharedValue<number>;
  name: string;
  tweetCount: number;
}

const shadow = "bg-black/60 rounded-full p-1 shadow-md";

export const UserProfileCustomHeader: React.FC<
  UserProfileCustomHeaderProps
> = ({ scrollY, name, tweetCount }) => {
  const styledBg = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [45, 100],
      [0, 0.7],
      Extrapolate.CLAMP,
    );

    return {
      backgroundColor: `rgba(0,0,0,${opacity})`,
    };
  });

  const styledTransform = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [40, 75],
      [40, 0],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [40, 75],
      [0, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  return (
    <Animated.View className="bg-black/70 px-4 pb-2 pt-3" style={styledBg}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-between space-x-2">
          <View className={shadow}>
            <GoBackButton color={"white"} />
          </View>
          <Animated.View style={styledTransform}>
            <Text className="text-xl font-bold text-white">{name}</Text>
            <Text className=" text-white">{tweetCount} Tweets</Text>
          </Animated.View>
        </View>

        <View className="flex-row items-center justify-between space-x-2">
          <View className={shadow}>
            <Ionicons name="search" size={20} color="white" />
          </View>
          <View className={shadow}>
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
