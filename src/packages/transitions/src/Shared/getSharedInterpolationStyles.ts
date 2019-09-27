import {
  SharedInterpolationType,
  TransitionItem,
  Style,
} from "../Components/Types";
import { getSharedInterpolationMetrics } from "./getSharedInterpolationMetrics";

export const getSharedInterpolationStyles = async (
  sharedInterpolation: SharedInterpolationType,
  ownerItem: TransitionItem,
  overriddenFromStyle?: Style,
) => {
  const { fromItem, toItem } = sharedInterpolation;

  // Get interpolation metrics
  const { fromMetrics, toMetrics } = await getSharedInterpolationMetrics(
    ownerItem,
    fromItem,
    toItem,
  );

  // Get style contexts
  const fromStyles = overriddenFromStyle || fromItem.getCalculatedStyles();
  const toStyles = toItem.getCalculatedStyles();
  delete fromStyles.opacity;
  delete toStyles.opacity;

  // Add position diff
  if (!overriddenFromStyle) {
    fromStyles.left = fromMetrics.x;
    fromStyles.top = fromMetrics.y;
    fromStyles.width = fromMetrics.width;
    fromStyles.height = fromMetrics.height;
    fromStyles.position = "absolute";
  }

  toStyles.left = toMetrics.x;
  toStyles.top = toMetrics.y;
  toStyles.width = toMetrics.width;
  toStyles.height = toMetrics.height;
  toStyles.position = "absolute";

  return { fromStyles, toStyles, fromMetrics, toMetrics };
};
