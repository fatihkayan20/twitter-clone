import { router, protectedProcedure } from "../trpc";

import notificationService from "../services/notificationService";
import followService from "../services/followService";
import { toggleFollowValidator } from "../validators/follow/toggleFollowValidator";
import { NotificationType } from "@acme/db";

export const followRouter = router({
  toggleFollow: protectedProcedure
    .input(toggleFollowValidator)
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
