import { z } from "zod";

export const createTweetValidator = z.object({
  content: z.string(),
  parentId: z.string().optional(),
});

export type ICreateTweetInputs = z.infer<typeof createTweetValidator>;
