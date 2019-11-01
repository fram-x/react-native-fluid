import {
  TransitionItem,
  SharedInterpolationType,
  AnimatedStyleKeys,
  Style,
  Easings,
} from "../Components/Types";
import { ConfigStyleInterpolationType, ConfigType } from "../Configuration";
import { getStyleInfo } from "../Styles/getStyleInfo";
import { getSharedInterpolationStyles } from "./getSharedInterpolationStyles";
import { getStateNameForTransition } from "./getStates";

export const setupSharedInterpolation = async (
  sharedInterpolation: SharedInterpolationType,
  ownerItem: TransitionItem,
  overriddenFromStyle?: Style,
) => {
  const { fromStyles, toStyles } = await getSharedInterpolationStyles(
    sharedInterpolation,
    ownerItem,
    overriddenFromStyle,
  );

  // Create clone configuration to enable swapping
  const fromOpacityInterpolation = createOpacityOverlapConfig([1, 1, 0, 0]);
  const toOpacityInterpolation = createOpacityOverlapConfig([0, 0, 1, 1]);

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
      state: getStateNameForTransition(sharedInterpolation),
      interpolation: [...interpolations, fromOpacityInterpolation],
    },
  };

  const toConfig: ConfigType = {
    onEnter: {
      onEnd: () => {
        console.log("Removing interpolation elements");
        sharedInterpolation.onAnimationDone &&
          sharedInterpolation.onAnimationDone();
      },
      state: getStateNameForTransition(sharedInterpolation),
      interpolation: [...interpolations, toOpacityInterpolation],
    },
    onExit: {
      onEnd: () => {
        console.log("Animation done.");
        sharedInterpolation.onAnimationFinished &&
          sharedInterpolation.onAnimationFinished();
      },
      state: getStateNameForTransition(sharedInterpolation),
      interpolation: {
        styleKey: "opacity",
        animation: {
          type: "timing",
          easing: Easings.linear,
          duration: 100,
        },
        inputRange: [0, 1],
        outputRange: [1, 1],
      },
    },
  };

  // Create clones
  sharedInterpolation.fromClone = sharedInterpolation.fromItem.clone({
    key: sharedInterpolation.fromId,
    label: sharedInterpolation.fromCloneLabel,
    // staticStyle: { borderWidth: 2, borderColor: "#0000FF" },
    style: [fromStyles, { opacity: 0 }],
    config: fromConfig,
    animation: sharedInterpolation.animation,
  });

  sharedInterpolation.toClone = sharedInterpolation.toItem.clone({
    key: sharedInterpolation.toId,
    label: sharedInterpolation.toCloneLabel,
    //  staticStyle: { borderWidth: 2, borderColor: "#FF0000" },
    style: [fromStyles, { opacity: 0 }],
    config: toConfig,
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
