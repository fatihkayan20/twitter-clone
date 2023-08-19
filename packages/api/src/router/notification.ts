import { firebaseFunctions } from "../firebase";
import notificationService from "../services/notificationService";
import { router, protectedProcedure } from "../trpc";

export const notificationRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await notificationService.getMyNotifications(ctx);

    if (!notifications.length) {
      return notifications;
    }

    await firebaseFunctions.readAllNotifications({
      userId: notifications[0]?.receiverId ?? "",
    });

    return notifications;
  }),
});
