import { ConfigInterpolatorType } from "./Types";
import { FluidLabel, getResolvedLabel } from "../Types";

export const InterpolationValue = (
  owner: string | FluidLabel,
  value: string,
): ConfigInterpolatorType => {
  return {
    ownerLabel: getResolvedLabel(owner) || "unknown",
    valueName: value,
  };
};
