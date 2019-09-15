import React, { useContext, useRef, useEffect, useState } from "react";
import {
  SharedInterpolationContext,
  TransitionItem,
  TransitionItemContextType,
  SharedInterpolationType,
  AnimationContextType,
  SharedInterpolationStatus,
  OnAnimationFunction,
  StateContextType,
  Easings,
  SharedInterpolationInfo
} from "../Types";
import { StyleSheet } from "react-native";
import { useForceUpdate } from "../../Hooks";
import { useLog } from "../../Hooks/useLog";
import {
  createOnAnimationDone,
  createSharedInterpolation,
  SharedStateName,
  setupSharedInterpolation,
  commitSharedInterpolation
} from "../../Shared";
import { TransitionView } from "../index";
import { fluidException, LoggerLevel, AsGroup } from "../../Types";
import {
  ConfigAnimationType,
  createConfig,
  ChildAnimationDirection,
  SafeStateConfigType,
  ConfigStateType
} from "../../Configuration";

export const useSharedInterpolation = (
  transitionItem: TransitionItem,
  transitionItemContext: TransitionItemContextType,
  configuration: SafeStateConfigType,
  stateContext: StateContextType,
  animationContext: AnimationContextType,
  currentDirection?: ChildAnimationDirection
) => {
  const sharedInterpolations = useRef(new Array<SharedInterpolationType>());
  const [sharedInterpolationInfos, setSharedInterpolationInfos] = useState(
    () => new Array<SharedInterpolationInfo>()
  );
  const sharedInterpolatorContext = useContext(SharedInterpolationContext);
  const forceUpdate = useForceUpdate();
  const logger = useLog(transitionItem.label, "shared");

  // set up config for interpolation
  configuration.when = configuration.when.concat([
    {
      state: SharedStateName + (transitionItem.label || "unknown"),
      interpolation: {
        animation: {
          type: "timing",
          easing: Easings.linear,
          duration: AsGroup
        },
        inputRange: [0, 0.0001, 0.9999, 1],
        outputRange: [1, 0, 0, 1],
        styleKey: "opacity"
      }
    }
  ]);

  const registerSharedInterpolationInfo = (
    fromLabel: string,
    toLabel: string,
    active: boolean
  ) => {
    const exinstingInfo = sharedInterpolationInfos.find(
      p => p.fromLabel === fromLabel && p.toLabel === toLabel
    );
    if (exinstingInfo) {
      exinstingInfo.active = active;
      return;
    }

    // Check if we can get the source/target items from this context
    const toItem = transitionItemContext.getTransitionItemByLabel(toLabel);
    const fromItem = transitionItemContext.getTransitionItemByLabel(fromLabel);

    // Check if we have found these two items
    if (fromItem && toItem) {
      setSharedInterpolationInfos(p => [
        ...p,
        {
          fromLabel,
          toLabel,
          active
        }
      ]);
    } else if (sharedInterpolatorContext) {
      // Walk up the tree
      sharedInterpolatorContext.registerSharedInterpolationInfo(
        fromLabel,
        toLabel,
        active
      );
    }
  };

  const registerSharedInterpolation = async (
    transitionItem: TransitionItem,
    fromLabel: string,
    toLabel: string,
    animation?: ConfigAnimationType,
    onBegin?: OnAnimationFunction,
    onEnd?: OnAnimationFunction
  ) => {
    // Check if we can get the source item from this context
    const ownerItem = transitionItemContext.getOwner();
    const toItem = transitionItemContext.getTransitionItemByLabel(
      transitionItem.label || "unknown"
    );

    // Check if current context knows about both to/from items
    const fromItem = transitionItemContext.getTransitionItemByLabel(fromLabel);
    if (fromItem && toItem) {
      if (__DEV__) {
        logger(
          () =>
            "Starting Shared Transition from " +
            fromItem.label +
            " -> " +
            toItem.label
        );
      }

      // Check if there is already an interpolation running here
      if (
        sharedInterpolations.current.find(
          p =>
            (p.fromLabel === fromLabel && p.toLabel === toLabel) ||
            (p.fromLabel === toLabel && p.toLabel === fromLabel)
        )
      ) {
        // There is already a shared interpolation going on here. We
        // should stop it and transfer the style values to the
        // new interpolation
        // TODO
      }

      // Create interpolation
      const sharedInterpolation: SharedInterpolationType = createSharedInterpolation(
        fromItem,
        toItem,
        currentDirection,
        animation,
        onBegin,
        onEnd
      );

      // Create onAnimationDone
      sharedInterpolation.onAnimationDone = createOnAnimationDone(
        sharedInterpolation,
        sharedInterpolations.current,
        () => forceUpdate()
      );

      // Add to list of preparing shared interpolations
      sharedInterpolations.current.push(sharedInterpolation);

      // Start setting up the shared interpolation
      sharedInterpolation.setupPromise = setupSharedInterpolation(
        sharedInterpolation,
        ownerItem
      );
    } else if (sharedInterpolatorContext) {
      // Walk up the tree to find parent root and start shared
      // interpolation from there.
      sharedInterpolatorContext.registerSharedInterpolation(
        transitionItem,
        fromLabel,
        toLabel,
        animation,
        onBegin,
        onEnd
      );
    } else {
      throw fluidException(
        "No container found for shared element transition. " +
          "Remember to wrap shared elements in a parent Fluid.View."
      );
    }
  };

  const setupPendingTransitions = () => {
    // Handle pending shared transitions
    const pendingSharedTransitions = sharedInterpolations.current.filter(
      p => p.status === SharedInterpolationStatus.Created
    );

    // Skip all logic if we don't have any pending transitions
    if (pendingSharedTransitions.length === 0) return;

    // Mark as started
    pendingSharedTransitions.forEach(
      si => (si.status = SharedInterpolationStatus.Preparing)
    );

    // Wait for all shared transitions to be set up
    const promises = pendingSharedTransitions.map(s => s.setupPromise);
    if (pendingSharedTransitions.length > 0) {
      Promise.all(promises).then(async () => {
        // Force update
        if (__DEV__) {
          logger(
            () =>
              "Resolved " +
              pendingSharedTransitions.length +
              " shared transitions."
          );
        }
        forceUpdate();
      });
    }
  };

  const commitSharedTransitions = async () => {
    // Handle started shared transitions
    const startedSharedTransitions = sharedInterpolations.current.filter(
      p => p.status === SharedInterpolationStatus.Prepared
    );

    // Skip all logic if we don't have any shared transitions
    if (startedSharedTransitions.length === 0) return;

    // Mark as finished
    startedSharedTransitions.forEach(
      si => (si.status = SharedInterpolationStatus.Active)
    );

    // Lets update to force our own context to start
    if (__DEV__) {
      logger(
        () => "Scheduling update due to commited shared interpolations",
        LoggerLevel.Verbose
      );
    }

    forceUpdate();

    // And then commit the transition by registering all style interpolations
    startedSharedTransitions.forEach(si =>
      commitSharedInterpolation(si, animationContext)
    );
  };

  const removeDeadTransitions = () => {
    sharedInterpolations.current = sharedInterpolations.current.filter(
      p => p.status !== SharedInterpolationStatus.Done
    );
  };

  useEffect(() => {
    // Lets skip out here to avoid setting up async contexts in functions below
    if (sharedInterpolations.current.length === 0) return;
    commitSharedTransitions();
    setupPendingTransitions();
  });

  // Find elements to render
  const sharedElementsToRender = sharedInterpolations.current.filter(
    p =>
      p.status !== SharedInterpolationStatus.Created &&
      p.status !== SharedInterpolationStatus.Done
  );

  // Set up states
  const sharedTransitionStates: ConfigStateType[] = sharedInterpolationInfos.map(
    p => ({
      name: SharedStateName + p.fromLabel,
      active:
        sharedInterpolations.current.find(
          p2 =>
            ((p.fromLabel === p2.fromLabel && p.toLabel === p2.toLabel) ||
              (p.toLabel === p2.fromLabel && p.fromLabel === p2.toLabel)) &&
            p2.status !== SharedInterpolationStatus.Done
        ) !== undefined
    })
  );

  // Remove elements that have status Died
  removeDeadTransitions();

  // Add states
  stateContext.states = [...stateContext.states, ...sharedTransitionStates];

  const renderSharedOverlay = (
    Component: any,
    props: any,
    hasChildren: boolean
  ): React.ReactChild => {
    if (!hasChildren) return <Component {...props} />;
    const { children, ...rest } = props;
    return (
      <Component {...rest}>
        {children}
        {sharedElementsToRender.length > 0 && (
          <TransitionView
            pointerEvents={"none"}
            label={"__sharedOverlay"}
            style={styles.overlayContainer}
            config={createConfig({ childAnimation: { type: "parallel" } })}
          >
            {sharedElementsToRender.map(c => [c.fromClone, c.toClone])}
          </TransitionView>
        )}
      </Component>
    );
  };

  return {
    renderSharedOverlay,
    sharedInterpolationContext: {
      registerSharedInterpolation,
      registerSharedInterpolationInfo
    }
  };
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject
    // overflow: "hidden"
    // backgroundColor: "#00FF0044"
  }
});
