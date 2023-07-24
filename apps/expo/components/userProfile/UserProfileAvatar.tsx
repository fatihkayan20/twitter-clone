import * as React from "react";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface UserProfileAvatarProps {
  url?: string | null;
  scrollY: SharedValue<number>;
}

export const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  url,
  scrollY,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const avatarSize = interpolate(
      scrollY.value,
      [0, 10],
      [60, 40],
      Extrapolate.CLAMP,
    );

    return {
      height: avatarSize,
      width: avatarSize,
    };
  });

  return (
    <Animated.Image
      source={{ uri: url ?? "" }}
      className="h-11 w-11 rounded-full "
      style={[animatedStyle]}
    />
  );
};
