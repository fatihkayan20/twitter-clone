import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const tweetRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tweet.findMany({
      include: {
        user: true,
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
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

  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.tweet.create({ data: input });
    }),
});
