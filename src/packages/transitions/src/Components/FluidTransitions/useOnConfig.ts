import {
  TransitionItem,
  StateChanges,
  ValueContextType,
  SharedInterpolationContextType,
} from "../Types";
import {
  SafeStateConfigType,
  ConfigAnimationType,
  isConfigOnShared,
  isConfigOnInterpolation,
  ConfigOnInterpolationType,
  ConfigOnSharedType,
  BaseConfigInterpolationType,
  isConfigStyleInterpolation,
  isConfigPropInterpolation,
  getResolvedStateName,
} from "../../Configuration";
import { getAnimationOnEnd } from "../../Animation/Builder/getAnimationOnEnd";
import { Dimensions } from "react-native";
import { fluidException } from "../../Types";

export const useOnConfig = (
  transitionItem: TransitionItem,
  styleContext: ValueContextType,
  propContext: ValueContextType,
  stateChanges: StateChanges,
  configuration: SafeStateConfigType,
  sharedInterpolationContext: SharedInterpolationContextType,
  animationType?: ConfigAnimationType,
) => {
  const configEnter = configuration.onEnter;
  const configExit = configuration.onExit;

  // Find all share interpolations
  const sharedOnConfigs = configEnter
    .concat(configExit)
    .filter(p => isConfigOnShared(p)) as ConfigOnSharedType[];

  // Register shared config info
  sharedOnConfigs.forEach(p => {
    const state = configuration.states.find(s => s.name === p.state);
    if (!state) {
      throw fluidException(
        `Could not find state ${p.state} for shared interpolation.`,
      );
    }
    sharedInterpolationContext.registerSharedInterpolationInfo(
      p.fromLabel,
      transitionItem.label || "unknown",
    );
  });

  const added = configEnter.filter(
    o =>
      stateChanges.added.find(s => s.name === getResolvedStateName(o.state)) !==
      undefined,
  );

  const changed = configEnter.filter(
    o =>
      stateChanges.changed.find(
        s => s.name === getResolvedStateName(o.state),
      ) !== undefined,
  );

  const removed = configExit.filter(
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

  // Loop through configs
  uniqueConfigs.forEach(onConfig => {
    // Check for shared interpolation
    if (isConfigOnShared(onConfig)) {
      // Let us register a shared interpolation
      addSharedInterpolation(onConfig, animationType);
    } else if (isConfigOnInterpolation(onConfig)) {
      // Register regular interpolation
      addInterpolation(onConfig, animationType);
    } else {
      // Register custom interpolation
      const { width, height } = Dimensions.get("screen");
      const factoryResults = onConfig.onFactory({
        screenSize: { width, height },
        metrics: transitionItem.metrics(),
        state: getResolvedStateName(onConfig.state),
        stateValue:
          typeof onConfig.state !== "string" ? onConfig.state.value : undefined,
        type:
          removed.find(p => p === onConfig) !== undefined ? "exit" : "enter",
      });
      addInterpolation(
        { state: onConfig.state, interpolation: factoryResults.interpolation },
        factoryResults.animation,
      );
    }
  });

  function addInterpolation(
    onConfig: ConfigOnInterpolationType,
    animation?: ConfigAnimationType,
  ) {
    if (
      onConfig.loop === Infinity ||
      onConfig.flip === Infinity ||
      onConfig.yoyo
    ) {
      throw fluidException(
        "Infinity loops not allowed on onEnter/onExit " +
          "because there is no way to stop them.",
      );
    }
    const interpolations: BaseConfigInterpolationType[] =
      onConfig.interpolation instanceof Array
        ? (onConfig.interpolation as Array<BaseConfigInterpolationType>)
        : [onConfig.interpolation];

    let onBegin = onConfig.onBegin;
    const onEnd = getAnimationOnEnd(
      Object.keys(interpolations).length,
      onConfig.onEnd,
    );

    // Loop through interpolations
    interpolations.forEach(interpolation => {
      // Setup interpolation
      const inputValues = interpolation.inputRange
        ? interpolation.inputRange.map(v => v)
        : undefined;
      const outputValues: Array<number | string> = [];
      interpolation.outputRange.forEach((v: string | number) =>
        outputValues.push(v),
      );

      // Check type of interpolation
      if (isConfigStyleInterpolation(interpolation)) {
        styleContext.addAnimation(
          interpolation.styleKey,
          inputValues,
          outputValues,
          interpolation.animation || onConfig.animation || animation,
          onBegin,
          onEnd,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
          onConfig.loop,
          onConfig.flip,
          onConfig.yoyo,
        );
      } else if (isConfigPropInterpolation(interpolation)) {
        propContext.addAnimation(
          interpolation.propName,
          inputValues,
          outputValues,
          interpolation.animation || onConfig.animation || animation,
          onBegin,
          onEnd,
          interpolation.extrapolate,
          interpolation.extrapolateLeft,
          interpolation.extrapolateRight,
          onConfig.loop,
          onConfig.flip,
          onConfig.yoyo,
        );
      }
    });
  }

  function addSharedInterpolation(
    onConfig: ConfigOnSharedType,
    animation?: ConfigAnimationType,
  ) {
    sharedInterpolationContext.registerSharedInterpolation(
      transitionItem,
      onConfig.fromLabel,
      transitionItem.label || "unknown",
      onConfig.animation || animation,
      onConfig.onBegin,
      onConfig.onEnd,
    );
  }
};
