import {
  TransitionItem,
  StateChanges,
  ValueContextType,
  Values
} from "../Types";
import { getStyleInfo } from "../../Styles/getStyleInfo";
import { useLog } from "../../Hooks";
import { UseLoggerFunction, LoggerLevel } from "../../Types";
import {
  ConfigAnimationType,
  ConfigWhenStyleType,
  ConfigWhenInterpolationType,
  SafeStateConfigType,
  isConfigWhenStyle,
  isConfigStyleInterpolation,
  isConfigPropInterpolation
} from "../../Configuration";
import { getAnimationOnEnd } from "../../Animation/Builder/getAnimationOnEnd";
import { stopAnimation } from "../../Animation/Runner/Functions";

export const useWhenConfig = (
  transitionItem: TransitionItem,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  stateChanges: StateChanges,
  configuration: SafeStateConfigType,
  animationType?: ConfigAnimationType
) => {
  const logger = useLog(transitionItem.label, "cwhen");

  const configs = configuration.when;

  const added = configs.filter(
    o => stateChanges.added.find(s => s.name === o.state) !== undefined
  );

  const changed = configs.filter(
    o => stateChanges.changed.find(s => s.name === o.state) !== undefined
  );

  const removed = configs.filter(
    o => stateChanges.removed.find(s => s.name === o.state) !== undefined
  );

  // Sort order?
  const allActiveConfigs = [...removed, ...added, ...changed];
  if (allActiveConfigs.length === 0) {
    return;
  }

  // Now we are ready to process the active when elements.
  // Lets loop through and find the unique ones
  const uniqueConfigs = allActiveConfigs.filter(
    (v, i, a) => a.indexOf(v) === i
  );

  uniqueConfigs.forEach(cf => {
    const isRemoved = removed.indexOf(cf) > -1;
    if (isConfigWhenStyle(cf)) {
      // When with style
      registerWhenStyle(logger, cf, styleContext, isRemoved, animationType);
    } else {
      // When with interpolation
      registerWhenInterpolations(
        transitionItem,
        logger,
        cf,
        styleContext,
        propContext,
        isRemoved,
        animationType
      );
    }
  });
};

const registerWhenInterpolations = (
  transitionItem: TransitionItem,
  logger: UseLoggerFunction,
  when: ConfigWhenInterpolationType,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  isRemoved: boolean,
  animationType?: ConfigAnimationType
) => {
  // No need to do anything if we don't have any interpolations
  const interpolations =
    when.interpolation instanceof Array
      ? when.interpolation
      : [when.interpolation];

  if (interpolations.length === 0) {
    return;
  }

  if (__DEV__) {
    logger(
      () =>
        "Register when(" +
        when.state +
        ") interpolation for " +
        Object.keys(interpolations).join(", "),
      LoggerLevel.Verbose
    );
  }

  let onBegin = when.onBegin;
  const onEnd = getAnimationOnEnd(
    Object.keys(interpolations).length,
    when.onEnd
  );

  interpolations.forEach(interpolation => {
    if (!isRemoved) {
      // Let us create the animation
      if (isConfigStyleInterpolation(interpolation)) {
        styleContext.addAnimation(
          interpolation.styleKey,
          interpolation.inputRange,
          interpolation.outputRange,
          interpolation.animation || when.animation || animationType,
          onBegin,
          onEnd,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
          when.loop,
          when.flip,
          when.yoyo
        );
      } else if (isConfigPropInterpolation(interpolation)) {
        propContext.addAnimation(
          interpolation.propName,
          interpolation.inputRange,
          interpolation.outputRange,
          interpolation.animation || when.animation || animationType,
          onBegin,
          onEnd,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
          when.loop,
          when.flip,
          when.yoyo
        );
      }
    } else {
      // Removed
      if (isConfigStyleInterpolation(interpolation)) {
        stopAnimation(transitionItem.id, interpolation.styleKey);
      } else if (isConfigPropInterpolation(interpolation)) {
        stopAnimation(transitionItem.id, interpolation.propName);
      }
    }
  });
};

const registerWhenStyle = (
  logger: UseLoggerFunction,
  when: ConfigWhenStyleType,
  styleContext: ValueContextType,
  isRemoved: boolean,
  animationType?: ConfigAnimationType
) => {
  // Find all values that needs interpolation
  const {
    styleKeys: nextStyleKeys,
    styleValues: nextStyleValues
  } = getStyleInfo(when.style);

  const interpolations: Values = {};

  // Find all values that needs interpolation
  nextStyleKeys.forEach(key => {
    if (nextStyleValues[key] !== styleContext.nextValues[key]) {
      interpolations[key] = nextStyleValues[key];
    }
  });

  if (Object.keys(interpolations).length === 0) return;

  if (__DEV__) {
    logger(
      () =>
        "Register when(" +
        when.state +
        ") style change for " +
        Object.keys(interpolations).join(", "),
      LoggerLevel.Verbose
    );
  }

  let onBegin = when.onBegin;
  const onEnd = getAnimationOnEnd(
    Object.keys(interpolations).length,
    when.onEnd
  );

  // Register interpolations
  Object.keys(interpolations).forEach(key => {
    // Let us create the animation
    styleContext.addAnimation(
      key,
      undefined,
      isRemoved
        ? [interpolations[key], undefined]
        : [undefined, interpolations[key]],
      when.animation ||
        animationType ||
        styleContext.descriptors[key].defaultAnimation,
      onBegin,
      onEnd,
      styleContext.descriptors[key].extrapolate,
      undefined,
      undefined,
      when.loop,
      when.flip,
      when.yoyo
    );
  });
};
