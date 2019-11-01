import { ConfigInterpolatorType } from "../Configuration/Types";

export const useInterpolationValue = (
  owner: string,
  value: string,
): ConfigInterpolatorType => {
  return {
    ownerLabel: owner,
    valueName: value,
  };
};
