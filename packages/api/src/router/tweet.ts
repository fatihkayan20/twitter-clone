import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

import likeService from "../services/likeService";
import notificationService from "../services/notificationService";
import tweetService from "../services/tweetService";
import { NotificationType } from "@acme/db";
import { getAllTweetsValidator } from "../validators/tweet/getAllTweetsValidator";
import { userTweetsValidator } from "../validators/tweet/userTweetsValidator";
import { getByIdValidator } from "../validators/tweet/getByIdValidator";
import { getSubTweetsValidator } from "../validators/tweet/getSubTweetsValidator";
import { toggleLikeValidator } from "../validators/tweet/toggleLikeValidator";
import { createTweetValidator } from "../validators/tweet/createTweetValidator";

export const tweetRouter = router({
  all: publicProcedure
    .input(getAllTweetsValidator)
    .query(async ({ ctx, input }) => {
      const tweets = await tweetService.getAllTweets(ctx, input);

      return tweets;
    }),

  userTweets: publicProcedure
    .input(userTweetsValidator)
    .query(async ({ ctx, input }) => {
      const tweets = await tweetService.getUserTweets(ctx, input);

      return tweets;
    }),

  getById: publicProcedure
    .input(getByIdValidator)
    .query(async ({ ctx, input }) => {
      const tweetDetail = await tweetService.getTweetDetail(ctx, input);

      return tweetDetail;
    }),

  getSubTweets: publicProcedure
    .input(getSubTweetsValidator)
    .query(async ({ ctx, input }) => {
      const subTweets = await tweetService.getSubTweets(ctx, input);

      return subTweets;
    }),

  toggleLike: protectedProcedure
    .input(toggleLikeValidator)
    .mutation(async ({ ctx, input }) => {
      const likeResponse = await likeService.toggleLike(ctx, input);

      await notificationService.createOrDeleteNotification(ctx, {
        type: NotificationType.LIKE,
        isLiked: likeResponse.isLiked,
        tweetId: input.tweetId,
        isSubTweet: likeResponse.isSubTweet,
        users: {
          sender: likeResponse.users.likedBy,
          receiver: likeResponse.users.author,
        },
      });

      return likeResponse;
    }),

  createTweet: protectedProcedure
    .input(createTweetValidator)
    .mutation(async ({ ctx, input }) => {
      const tweetResponse = await tweetService.createTweet(ctx, input);

      await notificationService.createOrDeleteNotification(ctx, {
        type: NotificationType.COMMENT,
        tweetId: tweetResponse.id,
        isSubTweet: !!input.parentId,
        users: {
          sender: tweetResponse.users.commentedBy,
          receiver: tweetResponse.users.author ?? "",
        },
      });

      return tweetResponse;
    }),
});
