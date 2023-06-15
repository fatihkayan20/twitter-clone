import * as React from "react";
import { Image } from "react-native";

interface AvatarProps {
  url?: string | null;
  size?: number;
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({ url, size }) => {
  return (
    <Image
      source={{ uri: url ?? "" }}
      className="h-11 w-11 rounded-full "
      style={[size ? { height: size, width: size } : {}]}
    />
  );
};
