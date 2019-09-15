import { StyleSheet } from "react-native";
import {
  TransitionItem,
  ValueContextType,
  Style,
  Values,
  OnAnimationFunction,
  AnimatedStyleKeys
} from "../Types";
import { useLog } from "../../Hooks/useLog";
import { LoggerLevel } from "../../Types";
import { ConfigAnimationType } from "../../Configuration";
import { getStyleInfo } from "../../Styles/getStyleInfo";
import { getAnimationOnEnd } from "../../Animation/Builder/getAnimationOnEnd";
import { useRef } from "react";

export const useInitialStyle = (
  transitionItem: TransitionItem,
  initialStyle: Style | Style[] | number | undefined,
  isMounted: boolean,
  styleContext: ValueContextType,
  animationType?: ConfigAnimationType,
  onAnimationBegin?: OnAnimationFunction,
  onAnimationDone?: OnAnimationFunction
) => {
  const logger = useLog(transitionItem.label, "inits");

  const initialStyleRef = useRef<Style | Style[] | number | undefined>();
  const initialStyleResolvedRef = useRef<Style | Style[]>();
  if (initialStyleRef.current !== initialStyle) {
    initialStyleRef.current = initialStyle;
    initialStyleResolvedRef.current = StyleSheet.flatten(initialStyle as any);
  }

  if (!initialStyle || isMounted) return;

  if (__DEV__) {
    logger(
      () => "Found initial style. Creating animations.",
      LoggerLevel.Verbose
    );
  }

  // Get information about the initial style
  const {
    styleKeys: initialStyleKeys,
    styleValues: initialStyleValues
  } = getStyleInfo(initialStyleResolvedRef.current);

  const interpolations: Values = {};

  // Find all values that needs interpolation
  initialStyleKeys.forEach(key => {
    if (initialStyleValues[key] !== styleContext.nextValues[key]) {
      interpolations[key] = initialStyleValues[key];
    }
  });

  if (Object.keys(interpolations).length === 0) return;

  if (__DEV__) {
    logger(
      () =>
        "Register initial style change for " +
        Object.keys(interpolations).join(", "),
      LoggerLevel.Verbose
    );
  }

  let onBegin = onAnimationBegin;
  const onEnd = getAnimationOnEnd(
    Object.keys(interpolations).length,
    onAnimationDone
  );

  // Register interpolations
  Object.keys(interpolations).forEach(key => {
    // Let us create the animation
    styleContext.addAnimation(
      key,
      undefined,
      [
        interpolations[key],
        styleContext.nextValues[key] || AnimatedStyleKeys[key].defaultValue
      ],
      animationType,
      onBegin,
      onEnd
    );
    // Remove after first interpolation
    onBegin = undefined;
  });
};
