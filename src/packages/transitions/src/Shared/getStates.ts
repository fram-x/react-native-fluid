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
    // Find active shared interpolation
    const sharedInterpolation = sharedInterpolations.find(
      si =>
        (si.fromLabel === st.fromLabel && si.toLabel === st.toLabel) ||
        (si.toLabel === st.fromLabel && si.toLabel === st.fromLabel),
    );
    const isPartOfInterpolation =
      sharedInterpolation !== undefined &&
      sharedInterpolation.status === SharedInterpolationStatus.Active;

    // Add 1) original from element
    retVal.push({
      name: getStateNameForLabel(st.fromLabel),
      active: isPartOfInterpolation,
    });
    // Add 2) original to element
    retVal.push({
      name: getStateNameForLabel(st.toLabel),
      active: isPartOfInterpolation,
    });
    // Add 3) shared transition state
    if (sharedInterpolation) {
      retVal.push({
        name: getStateNameForTransition(sharedInterpolation),
        active: isPartOfInterpolation,
      });
    }
  });
  return retVal.filter((v, i, a) => a.findIndex(n => n.name === v.name) === i);
};

export const getStateNameForLabel = (label: string | undefined) =>
  `${SharedStatePrefix}.${label || "unknown"}`;

export const getStateNameForTransition = (si: SharedInterpolationType) =>
  `${SharedStatePrefix}.${si.id}`;
