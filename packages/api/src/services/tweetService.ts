import { Context } from "../context";

const getAllTweets = async (ctx: Context) => {
  const tweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: null,
    },

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

  return tweets.map((tweet) => {
    const { likes, ...rest } = tweet;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  });
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

const getSubTweets = async (ctx: Context, input: { id: string }) => {
  const subTweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: {
        id: input.id,
      },
    },

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

  return subTweets.map((tweet) => {
    const { likes, ...rest } = tweet;

    return {
      ...rest,
      isLiked: likes.length > 0,
    };
  });
};

export default {
  getAllTweets,
  getTweetDetail,
  getSubTweets,
};
