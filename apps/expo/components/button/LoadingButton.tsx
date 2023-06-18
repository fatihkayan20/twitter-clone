import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  TextProps,
} from "react-native";

interface LoadingButtonProps extends PressableProps {
  labelClassName?: TextProps["className"];
  label: string;
  isLoading?: boolean;
  onPress: () => void;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  style,
  labelClassName,
  label,
  isLoading,
  onPress,
}) => {
  return (
    <Pressable style={style} onPress={!isLoading ? onPress : undefined}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`${labelClassName}`}>{label}</Text>
      )}
    </Pressable>
  );
};
