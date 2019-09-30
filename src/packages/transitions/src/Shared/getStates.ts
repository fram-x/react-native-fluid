import {
  SharedInterpolationType,
  SharedInterpolationInfo,
  SharedInterpolationStatus,
} from "../Components/Types";
import { ConfigStateType } from "../Configuration";

const SharedStatePrefix = "_s";

export const getStates = (
  sharedInterpolationInfos: SharedInterpolationInfo[],
  sharedInterpolations: SharedInterpolationType[],
): ConfigStateType[] => {
  // Return states for:
  // 1) Original from element
  // 2) Original to element
  // 3) Shared transition
  const retVal: ConfigStateType[] = [];
  sharedInterpolationInfos.forEach(st => {
    // Find active shared interpolations
    const sharedInterpolation = sharedInterpolations.find(
      si =>
        si.fromLabel === st.fromLabel &&
        si.toLabel === st.toLabel &&
        si.status === SharedInterpolationStatus.Active,
    );
    // Add 1) original from element
    retVal.push({
      name: getStateNameForLabel(st.fromLabel),
      active: sharedInterpolation !== undefined,
    });
    // Add 2) original to element
    retVal.push({
      name: getStateNameForLabel(st.toLabel),
      active: sharedInterpolation !== undefined,
    });
    // Add 3) shared transition state
    retVal.push({
      name: getStateNameForTransition(st),
      active: sharedInterpolation !== undefined,
    });
  });
  return retVal.filter((v, i, a) => a.findIndex(n => n.name === v.name) === i);
};

export const getStateNameForLabel = (label: string | undefined) =>
  `${SharedStatePrefix}.${label || "unknown"}`;

export const getStateNameForTransition = (si: SharedInterpolationInfo) =>
  `${SharedStatePrefix}.${si.fromLabel}-${si.toLabel}`;
