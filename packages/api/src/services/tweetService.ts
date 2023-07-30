import { Context } from "../context";
import { createUuid } from "../utils";
import { getNextCursor } from "../utils/infiniteQuery";
import { ICreateTweetInputs } from "../validators/tweet/createTweetValidator";
import { IGetAllTweetsInputs } from "../validators/tweet/getAllTweetsValidator";
import { IGetByIdInputs } from "../validators/tweet/getByIdValidator";
import { IGetSubTweetsInputs } from "../validators/tweet/getSubTweetsValidator";
import { IUserTweetsInputs } from "../validators/tweet/userTweetsValidator";

const getAllTweets = async (ctx: Context, input: IGetAllTweetsInputs) => {
  const limit = input.limit ?? 10;

  const tweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: null,
      ...(input.isFollowingOnly && {
        user: {
          followers: {
            some: {
              followingId: ctx.auth.userId,
            },
          },
        },
      }),
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

  const nextCursor = getNextCursor(tweets, limit);

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

const getUserTweets = async (ctx: Context, input: IUserTweetsInputs) => {
  const limit = input.limit ?? 10;

  const tweets = await ctx.prisma.tweet.findMany({
    where: {
      parent: null,
      user: {
        username: input.username,
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

  const nextCursor = getNextCursor(tweets, limit);

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

const getTweetDetail = async (ctx: Context, input: IGetByIdInputs) => {
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

const getSubTweets = async (ctx: Context, input: IGetSubTweetsInputs) => {
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

  const nextCursor = getNextCursor(subTweets, limit);

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

const createTweet = async (ctx: Context, input: ICreateTweetInputs) => {
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
    include: {
      user: true,
      parent: {
        include: {
          user: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const { parent, ...rest } = tweet;

  return {
    ...rest,
    users: {
      commentedBy: ctx.auth.userId as string,
      author: parent?.userId,
    },
  };
};

export default {
  getAllTweets,
  getUserTweets,
  getTweetDetail,
  getSubTweets,
  createTweet,
};
