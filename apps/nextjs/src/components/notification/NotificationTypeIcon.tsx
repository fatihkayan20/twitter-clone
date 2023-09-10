import { RouterOutput } from "@/../../packages/api";
import { NotificationType } from ".prisma/client";
import * as React from "react";
import { IoIosHeart, IoIosPerson, IoIosRepeat } from "react-icons/io";

interface NotificationTypeIconProps {
  notificationType: RouterOutput["notification"]["all"][number]["type"];
}

export const NotificationTypeIcon: React.FC<NotificationTypeIconProps> = ({
  notificationType,
}) => {
  const icons = {
    [NotificationType.LIKE]: <IoIosHeart size={30} className="text-red-700" />,
    [NotificationType.COMMENT]: (
      <IoIosRepeat size={30} className="text-black dark:text-gray-500" />
    ),
    [NotificationType.FOLLOW]: (
      <IoIosPerson size={30} className="text-black dark:text-gray-500" />
    ),
  };

  return icons[notificationType] ?? null;
};
