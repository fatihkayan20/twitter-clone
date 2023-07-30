import { z } from "zod";

export const getAllTweetsValidator = z.object({
  limit: z.number().optional(),
  cursor: z.string().optional(),
  isFollowingOnly: z.boolean().optional(),
});

export type IGetAllTweetsInputs = z.infer<typeof getAllTweetsValidator>;
