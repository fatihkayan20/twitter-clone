import { Context } from "../context";
import { createUuid } from "../utils";

const getAllTweets = async (
  ctx: Context,
  input: {
    limit?: number;
    cursor?: string;
  },
) => {
  const limit = input.limit ?? 10;

  const tweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: null,
    },
    cursor: input.cursor ? { id: input.cursor } : undefined,
    take: limit + 1,

    include: {
      user: true,
      likes: {
        where: {
          userId: ctx.auth.userId,
        },
      },
      _count: {
        select: {
          subTweets: true,
          likes: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  let nextCursor = undefined;

  if (tweets.length > limit) {
    const nextItem = tweets.pop();
    nextCursor = nextItem?.id;
  }

  const mappedTweets = tweets.map((tweet) => {
    const { likes, ...rest } = tweet;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  });

  return {
    items: mappedTweets,
    nextCursor,
  };
};

const getTweetDetail = async (ctx: Context, input: { id: string }) => {
  const tweetDetail = await ctx.prisma.tweet.findUnique({
    where: {
      id: input.id,
    },
    include: {
      user: true,
      likes: {
        where: {
          userId: ctx.auth.userId,
        },
      },
      subTweets: {
        take: 1,
        include: {
          user: true,
          likes: {
            where: {
              userId: ctx.auth.userId,
            },
          },
          _count: {
            select: {
              subTweets: true,
              likes: true,
            },
          },
        },
      },

      _count: {
        select: {
          subTweets: true,
          likes: true,
        },
      },
    },
  });

  if (!tweetDetail) {
    throw new Error("Tweet not found");
  }

  const { likes, subTweets, ...rest } = tweetDetail;

  return {
    ...rest,
    isLiked: likes.length > 0,
    subTweets: subTweets.map((tweet) => {
      const { likes, ...rest } = tweet;

      return {
        ...rest,
        isLiked: likes.length > 0,
        hasMore: rest._count.subTweets > 1,
      };
    }),
  };
};

const getSubTweets = async (
  ctx: Context,
  input: {
    id: string;
    limit?: number;
    cursor?: string;
  },
) => {
  const limit = input.limit ?? 10;

  const subTweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: {
        id: input.id,
      },
    },
    cursor: input.cursor ? { id: input.cursor } : undefined,
    take: limit + 1,

    include: {
      user: true,
      likes: {
        where: {
          userId: ctx.auth.userId,
        },
      },
      _count: {
        select: {
          subTweets: true,
          likes: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  let nextCursor = undefined;

  if (subTweets.length > limit) {
    const nextItem = subTweets.pop();
    nextCursor = nextItem?.id;
  }

  const mappedTweets = subTweets.map((tweet) => {
    const { likes, ...rest } = tweet;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  });

  return {
    items: mappedTweets,
    nextCursor,
  };
};

const createTweet = async (
  ctx: Context,
  input: { content: string; parentId?: string },
) => {
  const validId = createUuid();

  const tweet = await ctx.prisma.tweet.create({
    data: {
      id: validId,
      content: input.content,
      user: {
        connect: {
          id: ctx.auth.userId ?? "",
        },
      },
      ...(input.parentId && {
        parent: {
          connect: {
            id: input.parentId ?? "",
          },
        },
      }),
    },
  });

  return tweet;
};

export default {
  getAllTweets,
  getTweetDetail,
  getSubTweets,
  createTweet,
};
