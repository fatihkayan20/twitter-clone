import { NotificationType } from "@acme/db";
import { Context } from "../context";
import { createUuid } from "../utils";

const createLikeNotification = async (
  ctx: Context,
  data: ILikeATweetResponse,
) => {
  if (data.users.author === data.users.likedBy) {
    return;
  }

  if (data.isLiked) {
    const validId = createUuid();

    return ctx.prisma.notification.create({
      data: {
        id: validId,
        type: "LIKE",
        isSubTweet: data.isSubTweet,
        tweet: {
          connect: {
            id: data.tweetId,
          },
        },
        receiver: {
          connect: {
            id: data.users.author,
          },
        },
        sender: {
          connect: {
            id: data.users.likedBy,
          },
        },
      },
    });
  }

  return ctx.prisma.notification.deleteMany({
    where: {
      tweetId: data.tweetId,
      senderId: data.users.likedBy,
      receiverId: data.users.author,
      type: NotificationType.LIKE,
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
    },
  });
};

export default {
  createLikeNotification,
  getMyNotifications,
};
