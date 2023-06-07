import notificationService from "../services/notificationService";
import { router, protectedProcedure } from "../trpc";

export const notificationRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await notificationService.getMyNotifications(ctx);

    return notifications;
  }),
});
