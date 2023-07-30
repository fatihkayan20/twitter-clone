import { z } from "zod";

export const toggleFollowValidator = z.object({ userId: z.string() });

export type IToggleFollowInputs = z.infer<typeof toggleFollowValidator>;
