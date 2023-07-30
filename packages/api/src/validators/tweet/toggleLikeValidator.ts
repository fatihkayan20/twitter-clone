import { z } from "zod";

export const toggleLikeValidator = z.object({ tweetId: z.string() });

export type IToggleLikeInputs = z.infer<typeof toggleLikeValidator>;
