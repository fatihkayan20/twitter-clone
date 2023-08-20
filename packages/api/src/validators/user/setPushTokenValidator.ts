import { z } from "zod";

export const setPushTokenValidator = z.object({
  token: z.string(),
});

export type ISetPushTokenValidatorInputs = z.infer<
  typeof setPushTokenValidator
>;
