import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const tweetRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
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
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
    }),

  getSubTweets: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
    }),

  likeTweet: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isLiked = await ctx.prisma.like.findFirst({
        where: {
          tweetId: input.tweetId,
          userId: ctx.auth.userId,
        },
      });

      if (!!isLiked) {
        return ctx.prisma.like.delete({
          where: {
            userId_tweetId: {
              tweetId: input.tweetId,
              userId: ctx.auth.userId,
            },
          },
        });
      }

      const validId = uuidv4().toString().split("-").join("");

      return ctx.prisma.like.create({
        data: {
          id: validId,
          tweet: {
            connect: {
              id: input.tweetId,
            },
          },
          user: {
            connect: {
              id: ctx.auth.userId,
            },
          },
        },
      });
    }),
});
