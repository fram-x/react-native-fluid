import { useRef, useContext, useEffect } from "react";
import * as T from "../Types";
import { commitAnimations, commitInterpolations } from "../../Animation";
import { useLog, getFormattedTimeNum } from "../../Hooks/useLog";
import { LoggerLevel } from "../../Types";
import { IAnimationNode } from "react-native-fluid-animations";
import { ConfigAnimationType } from "../../Configuration";

type AnimationContextStatus = {
  isInAnimationContext: boolean;
};

/**
 * @description Animation context hook. This hook creates an
 * animation context that can be shared by multiple components,
 * and takes care of registering animations and playing them.
 */
export const useAnimationContext = (
  isMounted: boolean,
  transitionItem: T.TransitionItem,
  _resolvedAnimationType?: ConfigAnimationType
) => {
  const animationStatus = useRef<AnimationContextStatus>({
    isInAnimationContext: false
  });
  const interpolationInfos = useRef(new Array<T.InterpolationInfo>());
  const isInitialAnimation = useRef(true);
  const startTime = Date.now();

  const logger = useLog(transitionItem.label, "animc");
  const context = useContext(T.AnimationContext);

  /******************************************************
   * Context Markers
   ******************************************************/

  const setContextStart = () => {
    if (__DEV__) {
      logger(() => ">----------  context start", LoggerLevel.Always);
    }
    animationStatus.current.isInAnimationContext = true;
  };

  const setContextDone = () => {
    animationStatus.current.isInAnimationContext = false;
  };

  /******************************************************
   * Context functions
   ******************************************************/

  const isInAnimationContext = () => {
    if (context && context.isInAnimationContext()) return true;
    return animationStatus.current.isInAnimationContext;
  };

  const registerAnimation = (interpolationInfo: T.InterpolationInfo) => {
    if (context && context.isInAnimationContext()) {
      context.registerAnimation(interpolationInfo);
    } else {
      interpolationInfos.current.push(interpolationInfo);
    }
  };

  const registerInterpolation = (
    interpolator: IAnimationNode,
    interpolationInfo: T.InterpolationInfo
  ) => {
    // We don't care about the context we're in - just register
    commitInterpolations([{ interpolator, interpolationInfo }]);
  };

  /******************************************************
   * Functions
   ******************************************************/

  const commitPendingAnimations = () => {
    if (!isMounted && context && context.isInAnimationContext()) {
      // let parent to perform animations
      return;
    }

    // Start by finding style interpolations that needs to be set up
    if (interpolationInfos.current.length > 0) {
      if (__DEV__) {
        logger(
          () =>
            "Setting up " + interpolationInfos.current.length + " animations."
        );
      }
      // Now lets create animations from all interpolations waiting
      commitAnimations(
        transitionItem,
        interpolationInfos.current,
        isInitialAnimation.current
      );

      // Turn off first animation indicator
      isInitialAnimation.current = false;

      // Update - this will cause another lifecycle update
      // which will add interpolated styles to components so that
      // we can start animations
      interpolationInfos.current = [];
    }
  };

  /******************************************************
   * Lifecycle / Render
   ******************************************************/

  if (context && context.isInAnimationContext()) {
    // No update
  } else {
    setContextStart();
  }

  /**
   * @description Called from componentDidMount/componentDidUpdate
   */
  useEffect(() => {
    // Turn off flag until next update cycle
    const wasInContext = animationStatus.current.isInAnimationContext;

    if (!isMounted && context && context.isInAnimationContext()) {
      // let parent to perform animations
      return;
    }

    // Start by running any waiting animations
    commitPendingAnimations();

    // Mark context as done
    setContextDone();

    if (wasInContext && true) {
      logger(
        () =>
          "<----------  context end " +
          getFormattedTimeNum(Date.now() - startTime),
        LoggerLevel.Always
      );
    }
  });

  // Create context
  const animationContext: T.AnimationContextType = {
    isInAnimationContext,
    registerAnimation,
    registerInterpolation
  };

  return animationContext;
};
