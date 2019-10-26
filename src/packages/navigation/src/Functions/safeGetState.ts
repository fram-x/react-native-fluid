import {
  // @ts-ignore
  ConfigStateType,
} from "react-native-fluid-transitions";

export const safeGetState = (
  name: string,
  states: ConfigStateType[],
): ConfigStateType => {
  const state = states.find(s => s.name === name);
  if (!state) throw Error("State " + name + " not found.");
  return state;
};
