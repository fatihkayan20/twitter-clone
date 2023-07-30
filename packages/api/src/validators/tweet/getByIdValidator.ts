import { z } from "zod";

export const getByIdValidator = z.object({ id: z.string() });

export type IGetByIdInputs = z.infer<typeof getByIdValidator>;
