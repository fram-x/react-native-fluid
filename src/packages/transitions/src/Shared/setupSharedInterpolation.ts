import {
  SharedInterpolationStatus,
  TransitionItem,
  SharedInterpolationType,
  AnimatedStyleKeys,
  Style,
} from "../Components/Types";
import { ConfigStyleInterpolationType, ConfigType } from "../Configuration";
import { getStyleInfo } from "../Styles/getStyleInfo";
import { getSharedInterpolationStyles } from "./getSharedInterpolationStyles";

export const setupSharedInterpolation = async (
  sharedInterpolation: SharedInterpolationType,
  ownerItem: TransitionItem,
  overriddenFromStyle?: Style,
) => {
  const { stateName } = sharedInterpolation;

  const { fromStyles, toStyles } = await getSharedInterpolationStyles(
    sharedInterpolation,
    ownerItem,
    overriddenFromStyle,
  );

  // Create clone configuration to enable swapping
  const fromOpacityInterpolation = createOpacityOverlapConfig([0, 0, 1, 1]);
  const toOpacityInterpolation = createOpacityOverlapConfig([1, 1, 0, 0]);
  const states = [{ name: stateName, active: true }];

  // Get style information from / to
  const {
    styleKeys: fromStyleKeys,
    styleValues: fromStyleValues,
  } = getStyleInfo(fromStyles);

  const { styleKeys: toStyleKeys, styleValues: toStyleValues } = getStyleInfo(
    toStyles,
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
            : toStyleValues[key],
        ],
        extrapolate: AnimatedStyleKeys[key].extrapolate,
      });
    }
  });

  const fromConfig: ConfigType = {
    onEnter: {
      onEnd: sharedInterpolation.onAnimationDone,
      state: stateName,
      interpolation: [...interpolations, fromOpacityInterpolation],
    },
  };

  const toConfig: ConfigType = {
    onEnter: {
      state: stateName,
      interpolation: [...interpolations, toOpacityInterpolation],
    },
  };

  // Create clones
  sharedInterpolation.fromClone = sharedInterpolation.toItem.clone({
    key: sharedInterpolation.fromId,
    label: sharedInterpolation.fromCloneLabel,
    style: [fromStyles, { opacity: 0 }],
    config: fromConfig,
    states,
    animation: sharedInterpolation.animation,
  });

  sharedInterpolation.toClone = sharedInterpolation.fromItem.clone({
    key: sharedInterpolation.toId,
    label: sharedInterpolation.toCloneLabel,
    style: [fromStyles, { opacity: 0 }],
    config: toConfig,
    states,
    animation: sharedInterpolation.animation,
  });
};

const createOpacityOverlapConfig = (
  output: Array<number>,
): ConfigStyleInterpolationType => {
  return {
    styleKey: "opacity",
    inputRange: [0, 0.49, 0.51, 1],
    outputRange: output,
    extrapolate: "clamp",
  };
};
