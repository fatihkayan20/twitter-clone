import { router, protectedProcedure } from "../trpc";

import notificationService from "../services/notificationService";
import followService from "../services/followService";
import { createFollowValidator } from "../validators/follow/createFollowValidator";
import { NotificationType } from "@acme/db";

export const followRouter = router({
  toggleFollow: protectedProcedure
    .input(createFollowValidator)
    .mutation(async ({ ctx, input }) => {
      const followResponse = await followService.toggleFollow(ctx, input);

      await notificationService.createOrDeleteNotification(ctx, {
        type: NotificationType.FOLLOW,
        isFollowing: followResponse.isFollowing,
        users: {
          sender: followResponse.users.follower,
          receiver: followResponse.users.following,
        },
      });

      return followResponse;
    }),
});
