import { ConfigStateType } from "./Types";

export const createState = (
  name: string,
  active: boolean,
  value: number | string | undefined,
): ConfigStateType => {
  return { name, active, value };
};
