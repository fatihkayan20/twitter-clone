import { RouterOutput } from "@/../../packages/api";

export const getNotificationText = (
  notification: RouterOutput["notification"]["all"][number],
) => {
  const notificationText = {
    ["LIKE"]: `liked your ${notification.isSubTweet ? "comment" : "tweet"}`,
    ["COMMENT"]: `commented on your post`,
    ["FOLLOW"]: `started following you`,
  };

  return notificationText[notification.type];
};
