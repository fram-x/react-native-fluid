import {
  SharedInterpolationStatus,
  TransitionItem,
  SharedInterpolationType,
  AnimatedStyleKeys
} from "../Components/Types";
import { getSharedInterpolationMetrics } from "./getSharedInterpolationMetrics";
import { createOpacityOverlapConfig } from "./createOpacityOverlapConfig";
import {
  ConfigStyleInterpolationType,
  ConfigType
} from "../Configuration";
import { getStyleInfo } from "../Styles/getStyleInfo";

export const setupSharedInterpolation = async (
  sharedInterpolation: SharedInterpolationType,
  ownerItem: TransitionItem
) => {
  const { fromItem, toItem, stateName } = sharedInterpolation;

  // Get interpolation metrics
  const { fromMetrics, toMetrics } = await getSharedInterpolationMetrics(
    ownerItem,
    fromItem,
    toItem
  );

  // Get style contexts
  const fromStyles = fromItem.getCalculatedStyles();
  const toStyles = toItem.getCalculatedStyles();
  delete fromStyles.opacity;
  delete toStyles.opacity;

  // Add position diff
  fromStyles.left = fromMetrics.x;
  fromStyles.top = fromMetrics.y;
  fromStyles.width = fromMetrics.width;
  fromStyles.height = fromMetrics.height;
  fromStyles.position = "absolute";

  toStyles.left = toMetrics.x;
  toStyles.top = toMetrics.y;
  toStyles.width = toMetrics.width;
  toStyles.height = toMetrics.height;
  toStyles.position = "absolute";

  // Update shared info
  sharedInterpolation.fromStyles = fromStyles;
  sharedInterpolation.toStyles = toStyles;
  sharedInterpolation.fromMetrics = fromMetrics;
  sharedInterpolation.toMetrics = toMetrics;

  // Create clone configuration to enable swapping
  const fromOpacityInterpolation = createOpacityOverlapConfig([0, 0, 1, 1]);
  const toOpacityInterpolation = createOpacityOverlapConfig([1, 1, 0, 0]);
  const states = [{ name: stateName, active: true }];

  // Set up style interpolations
  const {
    styleKeys: fromStyleKeys,
    styleValues: fromStyleValues
  } = getStyleInfo(fromStyles);

  const { styleKeys: toStyleKeys, styleValues: toStyleValues } = getStyleInfo(
    toStyles
  );

  const interpolations: ConfigStyleInterpolationType[] = [];

  // Find unique style keys
  const uniqueKeys = fromStyleKeys
    .concat(toStyleKeys)
    .filter((v, i, a) => a.indexOf(v) === i);

  // Find all values that needs interpolation
  uniqueKeys.forEach(key => {
    if (toStyleValues[key] !== fromStyleValues[key]) {
      interpolations.push({
        styleKey: key,
        inputRange: [0, 1],
        outputRange: [
          fromStyleValues[key] === undefined
            ? AnimatedStyleKeys[key].defaultValue
            : fromStyleValues[key],
          toStyleValues[key] === undefined
            ? AnimatedStyleKeys[key].defaultValue
            : toStyleValues[key]
        ],
        extrapolate: AnimatedStyleKeys[key].extrapolate
      });
    }
  });

  const fromConfig: ConfigType = {
    onEnter: {
      onEnd: sharedInterpolation.onAnimationDone,
      state: stateName,
      interpolation: [...interpolations, fromOpacityInterpolation]
    }
  };

  const toConfig: ConfigType = {
    onEnter: {
      state: stateName,
      interpolation: [...interpolations, toOpacityInterpolation]
    }
  };

  // Create clones
  sharedInterpolation.fromClone = sharedInterpolation.toItem.clone({
    key: sharedInterpolation.fromId,
    overriddenTransitionId: sharedInterpolation.fromId,
    label: sharedInterpolation.fromLabel,
    style: [toStyles, { opacity: 0 }],
    ref: null,
    config: fromConfig,
    states,
    animation: sharedInterpolation.animation
  });

  sharedInterpolation.toClone = sharedInterpolation.fromItem.clone({
    key: sharedInterpolation.toId,
    overriddenTransitionId: sharedInterpolation.toId,
    label: sharedInterpolation.toLabel,
    style: [toStyles, { opacity: 0 }],
    ref: null,
    config: toConfig,
    states,
    animation: sharedInterpolation.animation
  });

  sharedInterpolation.status = SharedInterpolationStatus.Prepared;
};
