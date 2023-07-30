import { z } from "zod";
import userService from "../services/userService";
import { router, protectedProcedure } from "../trpc";
import { getByUsernameValidator } from "../validators/user/getByUsernameValidator";

export const userRouter = router({
  getByUsername: protectedProcedure
    .input(getByUsernameValidator)
    .query(async ({ ctx, input }) => {
      const userData = await userService.getByUsername(ctx, input);

      return userData;
    }),
});
