import {
  TransitionItem,
  StateChanges,
  ValueContextType,
  Values,
  InterpolatorContext,
  InterpolatorContextType,
} from "../Types";
import { getStyleInfo } from "../../Styles/getStyleInfo";
import { useLog } from "../../Hooks";
import { UseLoggerFunction, LoggerLevel, fluidException } from "../../Types";
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
  isConfigWhenFactory,
  ConfigWhenFactoryType,
} from "../../Configuration";
import { getAnimationOnEnd } from "../../Animation/Builder/getAnimationOnEnd";
import { useContext, useRef } from "react";
import { removeInterpolation } from "../../Animation/Runner/addInterpolation";
import { Dimensions } from "react-native";
import { InterpolationInfo } from "../Types";
import { unregisterRunningInterpolation } from "../../Animation/Runner/interpolationStorage";

export const useWhenConfig = (
  transitionItem: TransitionItem,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  stateChanges: StateChanges,
  configuration: SafeStateConfigType,
  animationType?: ConfigAnimationType,
) => {
  const logger = useLog(transitionItem.label, "cwhen");
  const interpolatorContext = useContext(InterpolatorContext);
  const runningInterpolationsRef = useRef<InterpolationInfo[]>([]);

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

  console.log(
    transitionItem.label,
    uniqueConfigs
      .map(
        cf =>
          getResolvedStateName(cf.state) +
          " (" +
          (removed.indexOf(cf) > -1 ? "removed" : "added") +
          ")",
      )
      .join(", "),
  );

  uniqueConfigs.forEach(cf => {
    const isRemoved = removed.indexOf(cf) > -1;
    if (isConfigWhenStyle(cf)) {
      // When with style
      registerWhenStyle(logger, cf, styleContext, isRemoved, animationType);
    } else if (isConfigWhenFactory(cf)) {
      // When with factory
      registerWhenWithFactory(
        transitionItem,
        cf,
        logger,
        styleContext,
        propContext,
        runningInterpolationsRef.current,
        interpolatorContext,
        isRemoved,
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
        runningInterpolationsRef.current,
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
  runningInterpolations: InterpolationInfo[],
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
        getResolvedStateName(when.state) +
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
      // Let us create the animation
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
        const interpolationInfo = styleContext.addInterpolation(
          interpolator,
          interpolation.styleKey,
          interpolation.inputRange,
          interpolation.outputRange,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
        );
        if (interpolationInfo) {
          runningInterpolations.push(interpolationInfo);
        }
      } else if (isConfigStyleInterpolation(interpolation)) {
        // console.log(
        //   transitionItem.label,
        //   "Adding",
        //   interpolation.styleKey,
        //   "[" + interpolation.outputRange.join(", ") + "]",
        // );
        const interpolationInfo = styleContext.addAnimation(
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
        if (interpolationInfo) {
          runningInterpolations.push(interpolationInfo);
        }
      } else if (isConfigPropInterpolation(interpolation)) {
        const interpolationInfo = propContext.addAnimation(
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
        if (interpolationInfo) {
          runningInterpolations.push(interpolationInfo);
        }
      }
    } else {
      // Removed
      if (isConfigWhenValueInterplation(interpolation)) {
        removeInterpolation(transitionItem.id, interpolation.styleKey);
      }
      // NO need to stop these I think, we'll just let them finish by themselves.
      else if (isConfigStyleInterpolation(interpolation)) {
        console.log(
          transitionItem.label,
          "Adding",
          interpolation.styleKey,
          "[" + interpolation.outputRange.join(", ") + "]",
        );
        removePossibleInterpolation(
          transitionItem.id,
          interpolation.styleKey,
          runningInterpolations,
        );
      } else if (isConfigPropInterpolation(interpolation)) {
        removePossibleInterpolation(
          transitionItem.id,
          interpolation.propName,
          runningInterpolations,
        );
      }
    }
  });
};

const removePossibleInterpolation = (
  id: number,
  key: string,
  runningInterpolations: InterpolationInfo[],
) => {
  const index = runningInterpolations.findIndex(p => p.key === key);
  if (index > -1) {
    unregisterRunningInterpolation(id, key, runningInterpolations[index].id);
    runningInterpolations.splice(index, 1);
  }
};

const registerWhenWithFactory = (
  transitionItem: TransitionItem,
  when: ConfigWhenFactoryType,
  logger: UseLoggerFunction,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  runningInterpolations: InterpolationInfo[],
  interpolatorContext: InterpolatorContextType | null,
  isRemoved: boolean,
  animationType?: ConfigAnimationType,
) => {
  const screenSize = Dimensions.get("screen");

  // Register custom interpolation
  const factoryResults = when.whenFactory({
    screenSize,
    metrics: transitionItem.metrics(),
    state: getResolvedStateName(when.state),
    stateValue: typeof when.state !== "string" ? when.state.value : undefined,
  });

  let interpolations =
    factoryResults.interpolation instanceof Array
      ? factoryResults.interpolation
      : [factoryResults.interpolation];

  registerWhenInterpolations(
    transitionItem,
    logger,
    {
      ...when,
      interpolation: interpolations,
      animation: animationType,
    } as ConfigWhenInterpolationType,
    styleContext,
    propContext,
    isRemoved,
    runningInterpolations,
    interpolatorContext,
    animationType,
  );
};

const registerWhenStyle = (
  logger: UseLoggerFunction,
  when: ConfigWhenStyleType,
  styleContext: ValueContextType,
  isRemoved: boolean,
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
        getResolvedStateName(when.state) +
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
    const outputRange = isRemoved
      ? [
          interpolations[key],
          styleContext.descriptors[key]
            ? styleContext.descriptors[key].defaultValue
            : undefined,
        ]
      : [undefined, interpolations[key]];

    // Let us create the animation
    styleContext.addAnimation(
      key,
      undefined,
      outputRange,
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
