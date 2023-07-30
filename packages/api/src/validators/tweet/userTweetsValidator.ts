import { z } from "zod";

export const userTweetsValidator = z.object({
  username: z.string(),
  limit: z.number().optional(),
  cursor: z.string().optional(),
});

export type IUserTweetsInputs = z.infer<typeof userTweetsValidator>;
