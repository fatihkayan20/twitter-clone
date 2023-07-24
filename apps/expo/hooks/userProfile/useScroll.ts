import * as React from "react";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScroll = () => {
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return {
    scrollY,
    handleScroll,
  };
};
