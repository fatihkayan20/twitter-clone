import { v4 as uuidv4 } from "uuid";

export const createUuid = (): string => {
  return uuidv4().toString().split("-").join("");
};
