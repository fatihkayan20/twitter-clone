import * as React from "react";
import { Image } from "react-native";

interface AvatarProps {
  url?: string | null;
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({ url }) => {
  return (
    <Image source={{ uri: url ?? "" }} className="h-11 w-11 rounded-full " />
  );
};
