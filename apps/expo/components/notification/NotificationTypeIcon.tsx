import { RouterOutput } from "@/../../packages/api";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";

interface NotificationTypeIconProps {
  notificationType: RouterOutput["notification"]["all"][number]["type"];
}

export const NotificationTypeIcon: React.FC<NotificationTypeIconProps> = ({
  notificationType,
}) => {
  const icons = {
    ["LIKE"]: <Ionicons name="heart" size={30} color="red" />,
    ["COMMENT"]: <Ionicons name="repeat" size={30} color="black" />,
    ["FOLLOW"]: <Ionicons name="person-outline" size={30} color="black" />,
  };

  return icons[notificationType] ?? null;
};
