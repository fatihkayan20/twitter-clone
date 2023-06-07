import { Context } from "../context";
import { createUuid } from "../utils";
import { prisma } from "./../../../db/index";

const likeTweet = async (
  ctx: Context,
  tweetId: string,
): Promise<ILikeATweetResponse> => {
  const post = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  if (!post) {
    throw new Error("Tweet not found");
  }

  const isLiked = await ctx.prisma.like.findFirst({
    where: {
      tweetId: tweetId,
      userId: ctx.auth.userId,
    },
  });

  if (!!isLiked) {
    await ctx.prisma.like.delete({
      where: {
        userId_tweetId: {
          tweetId: tweetId,
          userId: ctx.auth.userId as string,
        },
      },
    });

    return {
      isLiked: false,
      tweetId: tweetId,
      isSubTweet: !post.parentId,
      users: {
        likedBy: ctx.auth.userId as string,
        author: post.userId as string,
      },
    };
  }

  const validId = createUuid();

  await ctx.prisma.like.create({
    data: {
      id: validId,
      tweet: {
        connect: {
          id: tweetId,
        },
      },
      user: {
        connect: {
          id: ctx.auth.userId as string,
        },
      },
    },
  });

  return {
    isLiked: true,
    tweetId: tweetId,
    isSubTweet: !post.parentId,
    users: {
      likedBy: ctx.auth.userId as string,
      author: post.userId as string,
    },
  };
};

export default {
  likeTweet,
};
