import Image from "next/image";
import * as React from "react";

interface AvatarProps {
  url?: string | null;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ url, size }) => {
  return (
    <Image
      src={url ?? ""}
      className="h-11 w-11 rounded-full "
      width={size ?? 40}
      height={size ?? 40}
      alt="avatar"
    />
  );
};
