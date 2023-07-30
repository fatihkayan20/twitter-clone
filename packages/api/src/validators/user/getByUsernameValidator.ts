import { z } from "zod";

export const getByUsernameValidator = z.object({
  username: z.string(),
});

export type IGetByUsernameInputs = z.infer<typeof getByUsernameValidator>;
