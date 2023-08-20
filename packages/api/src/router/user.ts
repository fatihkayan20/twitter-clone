import userService from "../services/userService";
import { router, protectedProcedure } from "../trpc";
import { getByUsernameValidator } from "../validators/user/getByUsernameValidator";
import { setPushTokenValidator } from "../validators/user/setPushTokenValidator";

export const userRouter = router({
  getByUsername: protectedProcedure
    .input(getByUsernameValidator)
    .query(async ({ ctx, input }) => {
      const userData = await userService.getByUsername(ctx, input);

      return userData;
    }),

  setPushToken: protectedProcedure
    .input(setPushTokenValidator)
    .mutation(async ({ ctx, input }) => {
      const userData = await userService.setPushToken(ctx, input);

      return userData;
    }),
});
