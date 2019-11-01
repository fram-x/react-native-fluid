import { ConfigInterpolatorType } from "./Types";

export const InterpolationValue = (
  owner: string,
  value: string,
): ConfigInterpolatorType => {
  return {
    ownerLabel: owner,
    valueName: value,
  };
};
