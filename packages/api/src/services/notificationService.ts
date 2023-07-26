import { RouterOutputs } from "./../../../../apps/nextjs/src/utils/trpc";
import { NotificationType } from "@acme/db";
import { Context } from "../context";
import { createUuid } from "../utils";
import likeService from "./likeService";
import tweetService from "./tweetService";

const createLikeNotification = async (
  ctx: Context,
  data: Awaited<ReturnType<typeof likeService.likeTweet>>,
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

const createTweetNotification = async (
  ctx: Context,
  data: Awaited<ReturnType<typeof tweetService.createTweet>>,
) => {
  if (data.users.author === data.users.commentedBy) {
    return;
  }

  if (!data.parentId || !data.users.author) {
    return;
  }

  console.log("creatinmg notif");

  const validId = createUuid();

  return ctx.prisma.notification.create({
    data: {
      id: validId,
      type: "COMMENT",
      isSubTweet: !!data.parentId,
      tweet: {
        connect: {
          id: data.id,
        },
      },
      receiver: {
        connect: {
          id: data.users.author,
        },
      },
      sender: {
        connect: {
          id: data.users.commentedBy,
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
  createLikeNotification,
  createTweetNotification,
  getMyNotifications,
};
