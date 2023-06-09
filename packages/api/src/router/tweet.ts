import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

import likeService from "../services/likeService";
import notificationService from "../services/notificationService";
import tweetService from "../services/tweetService";

export const tweetRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const tweets = await tweetService.getAllTweets(ctx);

    return tweets;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tweetDetail = await tweetService.getTweetDetail(ctx, input);

      return tweetDetail;
    }),

  getSubTweets: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const subTweets = await tweetService.getSubTweets(ctx, input);

      return subTweets;
    }),

  likeTweet: protectedProcedure
    .input(z.object({ tweetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const likeResponse = await likeService.likeTweet(ctx, input.tweetId);

      await notificationService.createLikeNotification(ctx, likeResponse);

      return likeResponse;
    }),
});
