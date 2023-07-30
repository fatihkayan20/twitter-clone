import { router } from "../trpc";
import { followRouter } from "./follow";
import { notificationRouter } from "./notification";
import { tweetRouter } from "./tweet";
import { userRouter } from "./user";

export const appRouter = router({
  tweet: tweetRouter,
  notification: notificationRouter,
  user: userRouter,
  follow: followRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
