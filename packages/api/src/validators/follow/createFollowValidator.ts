import { z } from "zod";

export const createFollowValidator = z.object({ userId: z.string() });

export type CreateFollowValidatorType = z.infer<typeof createFollowValidator>;
