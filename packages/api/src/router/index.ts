import { router } from "../trpc";
import { notificationRouter } from "./notification";
import { tweetRouter } from "./tweet";

export const appRouter = router({
  tweet: tweetRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
