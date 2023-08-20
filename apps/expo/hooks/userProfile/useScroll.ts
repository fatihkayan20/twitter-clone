import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

interface ReturnType {
  scrollY: SharedValue<number>;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const useScroll = (): ReturnType => {
  const scrollY = useSharedValue(0);

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return {
    scrollY,
    handleScroll,
  };
};
