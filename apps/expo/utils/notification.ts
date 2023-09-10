import { NotificationType } from ".prisma/client";
import { RouterOutput } from "@/../../packages/api";

export const getNotificationText = (
  notification: RouterOutput["notification"]["all"][number],
): string => {
  const notificationText = {
    [NotificationType.LIKE]: `liked your ${
      notification.isSubTweet ? "comment" : "tweet"
    }`,
    [NotificationType.COMMENT]: `commented on your post`,
    [NotificationType.FOLLOW]: `started following you`,
  };

  return notificationText[notification.type];
};
