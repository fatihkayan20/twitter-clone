import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const tweetRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
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
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.tweet.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
          _count: {
            select: {
              subTweets: true,
              likes: true,
            },
          },
        },
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
