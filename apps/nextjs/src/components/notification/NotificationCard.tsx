import { RouterOutput } from "@/../../packages/api";
import * as React from "react";
import { Avatar } from "../common/Avatar";
import { NotificationTypeIcon } from "./NotificationTypeIcon";
import { getNotificationText } from "@/utils/notification";
import { useRouter } from "next/router";

interface NotificationCardProps {
  notification: RouterOutput["notification"]["all"][number];
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const router = useRouter();

  const handleNavigateDetail = (): void => {
    router.push(
      `/user/${notification.receiver?.username}${
        notification.tweetId ? `/status/${notification.tweetId}` : ""
      }`,
    );
  };

  const handleNavigateToUserProfile = (): void => {
    router.push(`/user/${notification.receiver?.username}`);
  };

  return (
    <button
      className="flex flex-1  border-b p-3 dark:text-white"
      onClick={handleNavigateDetail}
    >
      <NotificationTypeIcon notificationType={notification.type} />
      <div className="ml-2 flex flex-col items-start">
        <button onClick={handleNavigateToUserProfile}>
          <Avatar url={notification.sender?.profilePicture} />
        </button>
        <div className="my-3">
          <span className="font-bold ">{notification.sender?.name} </span>
          <span>{getNotificationText(notification)}</span>
        </div>

        <div className=" text-left text-gray-500">
          {notification.tweet?.content}
        </div>
      </div>
    </button>
  );
};
