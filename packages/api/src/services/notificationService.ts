import { NotificationType } from "@acme/db";
import { Context } from "../context";
import { createUuid } from "../utils";

type ILikeNotificationProps = {
  type: "LIKE";
  isLiked: boolean;
};

type ICommentNotificationProps = {
  type: "COMMENT";
};

type ICreateOrDeleteNotification = {
  tweetId: string;
  isSubTweet: boolean;
  users: {
    sender: string;
    receiver: string;
  };
} & (ILikeNotificationProps | ICommentNotificationProps);

const createOrDeleteNotification = async (
  ctx: Context,
  data: ICreateOrDeleteNotification,
) => {
  if (data.users.receiver === data.users.sender) {
    return;
  }

  const shouldDelete = data.type === NotificationType.LIKE && !data.isLiked;
  const shouldPass = data.type === NotificationType.COMMENT && !data.isSubTweet;

  if (shouldPass) {
    return;
  }

  if (shouldDelete) {
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

  return ctx.prisma.notification.create({
    data: {
      id: validId,
      type: data.type,
      isSubTweet: data.isSubTweet,
      tweet: {
        connect: {
          id: data.tweetId,
        },
      },
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
  });
};

export default {
  createOrDeleteNotification,
  getMyNotifications,
};
