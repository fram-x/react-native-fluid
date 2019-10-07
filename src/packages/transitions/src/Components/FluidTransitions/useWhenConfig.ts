import {
  TransitionItem,
  StateChanges,
  ValueContextType,
  Values,
  AnimatedStyleKeys,
  InterpolatorContext,
  InterpolatorContextType,
  InterpolationInfo,
} from "../Types";
import { getStyleInfo } from "../../Styles/getStyleInfo";
import { useLog } from "../../Hooks";
import {
  UseLoggerFunction,
  LoggerLevel,
  fluidException,
  fluidInternalException,
} from "../../Types";
import {
  ConfigAnimationType,
  ConfigWhenStyleType,
  ConfigWhenInterpolationType,
  SafeStateConfigType,
  isConfigWhenStyle,
  isConfigStyleInterpolation,
  isConfigPropInterpolation,
  getResolvedStateName,
  isConfigWhenValueInterplation,
} from "../../Configuration";
import { getAnimationOnEnd } from "../../Animation/Builder/getAnimationOnEnd";
import { useContext, useRef } from "react";
import {
  unregisterRunningInterpolation,
  stopRunningInterpolation,
} from "../../Animation/Runner/interpolations";

type ActiveInterpolations = { [key: string]: InterpolationInfo };

export const useWhenConfig = (
  transitionItem: TransitionItem,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  stateChanges: StateChanges,
  configuration: SafeStateConfigType,
  animationType?: ConfigAnimationType,
) => {
  const logger = useLog(transitionItem.label, "cwhen");

  // Store active interpolations
  const activeInterpolationsRef = useRef<ActiveInterpolations>({});

  // Get context for interpolators
  const interpolatorContext = useContext(InterpolatorContext);

  // Get the when part of the configuration and find changes
  const configs = configuration.when;
  const added = configs.filter(
    o =>
      stateChanges.added.find(s => s.name === getResolvedStateName(o.state)) !==
      undefined,
  );
  const changed = configs.filter(
    o =>
      stateChanges.changed.find(
        s => s.name === getResolvedStateName(o.state),
      ) !== undefined,
  );
  const removed = configs.filter(
    o =>
      stateChanges.removed.find(
        s => s.name === getResolvedStateName(o.state),
      ) !== undefined,
  );

  // Sort order?
  const allActiveConfigs = [...removed, ...added, ...changed];
  if (allActiveConfigs.length === 0) {
    return;
  }

  // Now we are ready to process the active when elements.
  // Lets loop through and find the unique ones
  const uniqueConfigs = allActiveConfigs.filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  uniqueConfigs.forEach(cf => {
    const isRemoved = removed.indexOf(cf) > -1;
    if (isConfigWhenStyle(cf)) {
      // When with style
      registerWhenStyle(
        logger,
        cf,
        styleContext,
        isRemoved,
        activeInterpolationsRef.current,
        animationType,
      );
    } else {
      // When with interpolation
      registerWhenInterpolations(
        transitionItem,
        logger,
        cf,
        styleContext,
        propContext,
        isRemoved,
        activeInterpolationsRef.current,
        interpolatorContext,
        animationType,
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
  activeInterpolations: ActiveInterpolations,
  interpolatorContext: InterpolatorContextType | null,
  animationType?: ConfigAnimationType,
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
      LoggerLevel.Verbose,
    );
  }

  let onBegin = when.onBegin;
  const onEnd = getAnimationOnEnd(
    Object.keys(interpolations).length,
    when.onEnd,
  );

  interpolations.forEach(interpolation => {
    if (!isRemoved) {
      // State was added/changed - create a new animation/interpolation
      let ip: InterpolationInfo | undefined;
      let key: string | undefined;

      if (isConfigWhenValueInterplation(interpolation)) {
        if (!interpolatorContext) {
          throw fluidException(
            "A when config element refers to a value but is not " +
              "contained in a parent fluid view.",
          );
        }
        const interpolator = interpolatorContext.getInterpolator(
          interpolation.value.ownerLabel,
          interpolation.value.valueName,
        );

        if (!interpolator) {
          throw fluidException(
            "Could not find interpolator with name " +
              interpolation.value.valueName +
              " in component with label " +
              interpolation.value.ownerLabel,
          );
        }

        key = interpolation.styleKey;
        ip = styleContext.addInterpolation(
          interpolator,
          interpolation.styleKey,
          interpolation.inputRange,
          interpolation.outputRange,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
        );
      } else if (isConfigStyleInterpolation(interpolation)) {
        key = interpolation.styleKey;
        ip = styleContext.addAnimation(
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
          when.yoyo,
        );
      } else if (isConfigPropInterpolation(interpolation)) {
        key = interpolation.propName;
        ip = propContext.addAnimation(
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
          when.yoyo,
        );
      }
      // Make sure we keep track of running animations, and that we
      // remove previous animations/interpolations that we have added
      if (ip && key) {
        // Check if there is a running animation that we created
        if (activeInterpolations[key]) {
          // Stop the previous one that was emitted by us
          // TODO
        }
        activeInterpolations[key] = ip;
      }
    } else {
      // Removed
      let key: string | undefined;
      if (
        isConfigWhenValueInterplation(interpolation) ||
        isConfigStyleInterpolation(interpolation)
      ) {
        key = interpolation.styleKey;
      } else if (isConfigPropInterpolation(interpolation)) {
        key = interpolation.propName;
      } else {
        key = "";
        throw fluidException("Unknown interpolation type");
      }

      if (activeInterpolations[key]) {
        // TODO: Stop running animation
        stopRunningInterpolation(
          transitionItem.id,
          key,
          activeInterpolations[key].id,
        );

        // Remove from active interpolations
        delete activeInterpolations[key];
      } else {
        throw fluidInternalException(
          "Could not find interpolation for key " +
            key +
            " when trying to remove the interpolation since the state " +
            getResolvedStateName(when.state) +
            " was removed.",
        );
      }
    }
  });
};

const registerWhenStyle = (
  logger: UseLoggerFunction,
  when: ConfigWhenStyleType,
  styleContext: ValueContextType,
  isRemoved: boolean,
  activeInterpolations: ActiveInterpolations,
  animationType?: ConfigAnimationType,
) => {
  // Find all values that needs interpolation
  const {
    styleKeys: nextStyleKeys,
    styleValues: nextStyleValues,
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
      LoggerLevel.Verbose,
    );
  }

  let onBegin = when.onBegin;
  const onEnd = getAnimationOnEnd(
    Object.keys(interpolations).length,
    when.onEnd,
  );

  // Register interpolations
  Object.keys(interpolations).forEach(key => {
    // Let us create the animation
    styleContext.addAnimation(
      key,
      undefined,
      isRemoved
        ? [interpolations[key], AnimatedStyleKeys[key].defaultValue]
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
      when.yoyo,
    );
  });
};
