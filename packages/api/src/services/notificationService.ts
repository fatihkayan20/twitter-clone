import { NotificationType } from "@acme/db";
import { Context } from "../context";
import { createUuid } from "../utils/createUuid";
import { firebaseFunctions } from "../firebase";

type ILikeNotificationProps = {
  type: "LIKE";
  isLiked: boolean;
  isSubTweet: boolean;
};

type ICommentNotificationProps = {
  type: "COMMENT";
  isSubTweet: boolean;
};

type IFollowNotificationProps = {
  type: "FOLLOW";
  isFollowing: boolean;
};

type ICreateOrDeleteNotification = {
  tweetId?: string;
  users: {
    sender: string;
    receiver: string;
  };
} & (
  | ILikeNotificationProps
  | ICommentNotificationProps
  | IFollowNotificationProps
);

const sendExpoNotification = async (
  ctx: Context,
  notification: ICreateOrDeleteNotification,
) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      id: notification.users.receiver,
    },
  });

  if (!user || !user.pushToken) {
    return;
  }

  const sender = await ctx.prisma.user.findUnique({
    where: {
      id: notification.users.sender,
    },
  });

  if (!sender) {
    return;
  }

  const titles: Record<NotificationType, string> = {
    [NotificationType.LIKE]: "New like",
    [NotificationType.COMMENT]: "New comment",
    [NotificationType.FOLLOW]: "New follower",
  };

  const bodies: Record<NotificationType, string> = {
    [NotificationType.LIKE]: `${sender.username} liked your tweet`,
    [NotificationType.COMMENT]: `${sender.username} commented on your tweet`,
    [NotificationType.FOLLOW]: `${sender.username} followed you`,
  };

  const message = {
    to: user.pushToken,
    sound: "default",
    title: titles[notification.type],
    body: bodies[notification.type],
    data: {
      tweetId: notification.tweetId,
      senderId: notification.users.sender,
    },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

const createOrDeleteNotification = async (
  ctx: Context,
  data: ICreateOrDeleteNotification,
) => {
  if (data.users.receiver === data.users.sender) {
    return;
  }

  const shouldDelete =
    (data.type === NotificationType.LIKE && !data.isLiked) ||
    (data.type === NotificationType.FOLLOW && !data.isFollowing);
  const shouldPass = data.type === NotificationType.COMMENT && !data.isSubTweet;

  if (shouldPass) {
    return;
  }

  if (shouldDelete) {
    await firebaseFunctions.removeNotification({
      userId: data.users.receiver,
      type: "notification",
    });

    return ctx.prisma.notification.deleteMany({
      where: {
        tweetId: data.tweetId,
        senderId: data.users.sender,
        receiverId: data.users.receiver,
        type: data.type,
      },
    });
  }

  const validId = createUuid();

  const notification = ctx.prisma.notification.create({
    data: {
      id: validId,
      type: data.type,
      ...(data.tweetId && {
        tweet: {
          connect: {
            id: data.tweetId,
          },
        },
      }),
      isSubTweet: data.type == NotificationType.LIKE ? data.isSubTweet : false,
      receiver: {
        connect: {
          id: data.users.receiver,
        },
      },
      sender: {
        connect: {
          id: data.users.sender,
        },
      },
    },
  });

  await firebaseFunctions.addNotification({
    userId: data.users.receiver,
    type: "notification",
  });

  await sendExpoNotification(ctx, data);

  return notification;
};

const getMyNotifications = async (ctx: Context) => {
  return ctx.prisma.notification.findMany({
    where: {
      receiverId: ctx.auth.userId,
    },
    include: {
      tweet: true,
      sender: true,
      receiver: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export default {
  createOrDeleteNotification,
  getMyNotifications,
};
