import {
  InterpolationInfo,
  TransitionItem,
  Easings,
  getNextInterpolationInfoId,
  OnAnimationFunction,
} from "../Components/Types";
import { fluidInternalException, LoggerLevel } from "../Types";
import { AnimationProvider } from "react-native-fluid-animations";
import { InteractionManager } from "react-native";
import { getResolvedAnimation } from "./Functions/getResolvedAnimation";
import { TimingDefaultAnimationType } from "../Utilities";
import {
  getInterpolationTree,
  findNodeByInterpolationId,
} from "./Builder/getInterpolationTree";
import { getLogLevel, log } from "../Hooks";
import { dumpTree } from "./Builder/dumpTree";
import { addAnimations } from "./Runner";
import { AnimationInfo } from "../Components/Types/AnimationInfo";
import { isConfigAnimationTiming } from "../Configuration";
import { IsAnimationRemoved } from "./Runner/Functions";

export function commitAnimations(
  root: TransitionItem,
  interpolationInfos: Array<InterpolationInfo>,
  waitForInteractions: boolean = false,
) {
  if (!root.isAlive()) {
    return;
  }
  // Skip empty
  if (interpolationInfos.length === 0) {
    return;
  }

  if (__DEV__) {
    log(
      root.label,
      "animc",
      "Starting " + interpolationInfos.length + " animations.",
      LoggerLevel.Verbose,
    );
  }

  // Find all interpolation ids - items participating in the animation
  const itemIds = interpolationInfos.map(ip => ip.itemId);

  // Resolve all springs to springbased timing easings
  interpolationInfos.forEach(ii => {
    // Resolve animation - this is where we convert the spring
    // definition to a spring based easing.
    ii.animationType = getResolvedAnimation(
      ii.animationType || TimingDefaultAnimationType,
    );
  });

  // Build tree
  // Get interpolation tree
  const tree = getInterpolationTree(root, interpolationInfos, itemIds);
  if (!tree) {
    // Let's just return - we might have started a repeat but the component
    // has been removed.
    return;
  }

  // Dump tree
  if (__DEV__) {
    getLogLevel() === LoggerLevel.Detailed && dumpTree(tree, console.log);
  }

  // Validate that we have animations with duration - we might be in a
  // where we don't need to run this at all.
  if (tree.subtreeDuration === 0 || tree.subtreeDuration === undefined) {
    // Set as Dead
    interpolationInfos.forEach(info => {
      info.onEnd && setImmediate(info.onEnd);
      info.onBegin && setImmediate(info.onBegin);
    });
    return;
  }

  // Create master interpolator
  const masterInterpolator = AnimationProvider.createValue(0);

  // Create list of animations that should be looped
  const loopAnimations: { [key: number]: InterpolationInfo } = {};
  const loopInterpolations: InterpolationInfo[] = [];
  const checkForLoopedAnimations = (
    interpolationId: number,
    onEnd?: OnAnimationFunction,
  ) => () => {
    loopInterpolations.push(loopAnimations[interpolationId]);
    delete loopAnimations[interpolationId];
    if (Object.keys(loopAnimations).length === 0) {
      log(
        root.label,
        "commit",
        "restart" + interpolationId.toString(),
        LoggerLevel.Always,
      );
      // We have someone that needs to be looped
      if (loopInterpolations.length > 0) {
        const repeatAnimations = loopInterpolations.filter(
          p => !IsAnimationRemoved(p.itemId, p.key),
        );
        if (repeatAnimations.length > 0) {
          commitAnimations(root, repeatAnimations);
        }
      }
    }

    onEnd && onEnd();
  };

  // Set up listeners
  const animationInfos: AnimationInfo[] = [];
  interpolationInfos.forEach(interpolationInfo => {
    // Mark as started
    const node = findNodeByInterpolationId(interpolationInfo.id, tree);
    if (!node) {
      throw fluidInternalException("Could not find node for interpolationinfo");
    }

    const { interpolationConfig, onEnd, onBegin } = interpolationInfo;

    const {
      inputRange,
      outputRange,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
    } = interpolationConfig;

    const easing = interpolationInfo.animationType
      ? interpolationInfo.animationType.type === "timing" &&
        interpolationInfo.animationType.easing
        ? interpolationInfo.animationType.easing
        : Easings.linear
      : Easings.linear;

    if (!easing.name) {
      console.warn("Easing is missing name");
    }
    const easingKey = easing.name || "unknown";

    // Looping
    let isRepeating = false;
    if (interpolationInfo.loop) {
      isRepeating = decorateWithRepeat(
        "loop",
        interpolationInfo.loop,
        interpolationInfo,
        loopAnimations,
      );
    } else if (interpolationInfo.flip) {
      isRepeating = decorateWithRepeat(
        "flip",
        interpolationInfo.flip,
        interpolationInfo,
        loopAnimations,
      );
    } else if (interpolationInfo.yoyo) {
      isRepeating = decorateWithRepeat(
        "yoyo",
        interpolationInfo.yoyo,
        interpolationInfo,
        loopAnimations,
      );
    }

    let onAnimationEnd = isRepeating
      ? checkForLoopedAnimations(interpolationInfo.id, onEnd)
      : onEnd;

    // Create tracker info
    animationInfos.push({
      animationId: interpolationInfo.id,
      interpolate: interpolationInfo.interpolate,
      ownerId: interpolationInfo.itemId,
      key: interpolationInfo.key,
      target: interpolationInfo.interpolator,
      inputRange: inputRange || [0, 1],
      outputRange,
      duration: node.duration,
      offset: node.offset,
      extrapolate,
      extrapolateLeft,
      extrapolateRight,
      easing,
      easingKey,
      onBegin,
      onEnd: onAnimationEnd,
    });
  });

  // Setup trackers
  addAnimations(masterInterpolator, animationInfos);

  // Setup Animation
  const duration = tree.subtreeDuration;
  const runAnimation = () => {
    AnimationProvider.runTiming(masterInterpolator, duration, () => {
      if (__DEV__) {
        log(
          root.label,
          "animc",
          "Master Animation finished for " +
            interpolationInfos.length +
            " animations.",
          LoggerLevel.Verbose,
        );
      }
    });
  };

  // Run
  if (waitForInteractions) {
    InteractionManager.runAfterInteractions(runAnimation);
  } else {
    runAnimation();
  }
}

function decorateWithRepeat(
  repeatType: "flip" | "loop" | "yoyo",
  repeatValue: number,
  interpolationInfo: InterpolationInfo,
  loopAnimations: { [key: string]: InterpolationInfo },
) {
  if (
    repeatValue === 0
    // ||
    //!IsAnimationRunning(interpolationInfo.itemId, interpolationInfo.key)
  ) {
    return false;
  }

  // Copy interpolation config
  const { interpolationConfig, animationType } = interpolationInfo;

  // Flip?
  const flipAnimation = (reverse: boolean) => {
    interpolationConfig.outputRange = [
      ...interpolationConfig.outputRange,
    ].reverse();

    if (
      reverse &&
      animationType &&
      isConfigAnimationTiming(animationType) &&
      animationType.easing
    ) {
      animationType.easing = Easings.out(animationType.easing);
    }
  };

  switch (repeatType) {
    case "loop":
      break;
    case "flip": {
      flipAnimation(false);
      break;
    }
    case "yoyo": {
      flipAnimation(true);
      break;
    }
  }

  // Restart animation!
  loopAnimations[interpolationInfo.id] = {
    ...interpolationInfo,
    interpolationConfig,
    animationType,
    id: getNextInterpolationInfoId(),
    [repeatType]: repeatValue === Infinity ? repeatValue : repeatValue - 1,
  };

  return true;
}
