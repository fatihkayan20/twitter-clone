import { z } from "zod";
import userService from "../services/userService";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getByUsername: protectedProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userData = await userService.getByUsername(ctx, input);

      return userData;
    }),
});
