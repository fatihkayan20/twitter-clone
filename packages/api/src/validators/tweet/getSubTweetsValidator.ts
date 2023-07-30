import { z } from "zod";

export const getSubTweetsValidator = z.object({
  id: z.string(),
  limit: z.number().optional(),
  cursor: z.string().optional(),
});

export type IGetSubTweetsInputs = z.infer<typeof getSubTweetsValidator>;
