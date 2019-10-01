import React, { useContext, useRef, useEffect, useState, useMemo } from "react";
import {
  SharedInterpolationContext,
  TransitionItem,
  TransitionItemContextType,
  SharedInterpolationType,
  SharedInterpolationStatus,
  OnAnimationFunction,
  StateContextType,
  SharedInterpolationInfo,
  Style,
} from "../Types";
import { StyleSheet } from "react-native";
import { useForceUpdate } from "../../Hooks";
import { useLog } from "../../Hooks/useLog";
import {
  createSharedInterpolation,
  setupSharedInterpolation,
  getStates,
  getStateNameForLabel,
} from "../../Shared";
import { TransitionView } from "../index";
import { fluidException, fluidInternalException, AsGroup } from "../../Types";
import {
  ConfigAnimationType,
  createConfig,
  ChildAnimationDirection,
  SafeStateConfigType,
  ConfigOnType,
  ConfigType,
} from "../../Configuration";

export const useSharedInterpolation = (
  transitionItem: TransitionItem,
  transitionItemContext: TransitionItemContextType,
  configuration: SafeStateConfigType,
  stateContext: StateContextType,
  currentDirection?: ChildAnimationDirection,
) => {
  const sharedInterpolations = useRef<Array<SharedInterpolationType>>([]);
  const [sharedInterpolationInfos, setSharedInterpolationInfos] = useState<
    Array<SharedInterpolationInfo>
  >([]);
  const sharedInterpolatorContext = useContext(SharedInterpolationContext);
  const forceUpdate = useForceUpdate();
  const logger = useLog(transitionItem.label, "shared");

  // State name for this transition item's shared element transition
  const sharedTransitionStateName = getStateNameForLabel(transitionItem.label);
  decorateConfiguration(sharedTransitionStateName, configuration);

  const registerSharedInterpolationInfo = (
    fromLabel: string,
    toLabel: string,
  ) => {
    const exinstingInfo = sharedInterpolationInfos.find(
      p => p.fromLabel === fromLabel && p.toLabel === toLabel,
    );
    if (exinstingInfo) {
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
        },
      ]);
    } else if (sharedInterpolatorContext) {
      // Walk up the tree
      sharedInterpolatorContext.registerSharedInterpolationInfo(
        fromLabel,
        toLabel,
      );
    }
  };

  const registerSharedInterpolation = async (
    item: TransitionItem,
    fromLabel: string,
    toLabel: string,
    animation?: ConfigAnimationType,
    onBegin?: OnAnimationFunction,
    onEnd?: OnAnimationFunction,
  ) => {
    // Check if we can get the source item from this context
    const ownerItem = transitionItemContext.getOwner();
    const toItem = transitionItemContext.getTransitionItemByLabel(
      item.label || "unknown",
    );

    let overriddenFromStyle: Style | undefined;

    // Check if current context knows about both to/from items
    const fromItem = transitionItemContext.getTransitionItemByLabel(fromLabel);
    if (fromItem && toItem) {
      if (__DEV__) {
        logger(
          () =>
            "Starting Shared Transition from " +
            fromItem.label +
            " -> " +
            toItem.label,
        );
      }

      // Check if there is already an interpolation running here
      const existingInterpolation = sharedInterpolations.current.find(
        p =>
          (p.fromLabel === fromLabel && p.toLabel === toLabel) ||
          (p.fromLabel === toLabel && p.toLabel === fromLabel),
      );
      if (existingInterpolation) {
        // There is already a shared interpolation going on here. We
        // should stop it and transfer the style values to the
        // new interpolation
        const fromItemClone = transitionItemContext.getTransitionItemByLabel(
          existingInterpolation.fromCloneLabel,
        );

        if (!fromItemClone) {
          throw fluidInternalException(
            "Could not find clones in onging interpolation.",
          );
        }
        // Overriden from style
        overriddenFromStyle = fromItemClone.getCalculatedStyles();
      }

      // Create interpolation
      const sharedInterpolation: SharedInterpolationType = createSharedInterpolation(
        fromItem,
        toItem,
        currentDirection,
        animation,
        onBegin,
        onEnd,
      );

      // Create onAnimationDone
      sharedInterpolation.onAnimationDone = () => {
        const s = sharedInterpolations.current.find(
          si => si.id === sharedInterpolation.id,
        );
        if (s && s.status === SharedInterpolationStatus.Active) {
          s.status = SharedInterpolationStatus.Removing;
          forceUpdate();
          // TODO: Callback to user-land?
        }
      };

      sharedInterpolation.onAnimationFinished = () => {
        const s = sharedInterpolations.current.find(
          si => si.id === sharedInterpolation.id,
        );
        if (s && s.status === SharedInterpolationStatus.Removing) {
          s.status = SharedInterpolationStatus.Done;
          forceUpdate();
          // TODO: Callback to user-land?
        }
      };

      // Add to list of preparing shared interpolations
      sharedInterpolations.current.push(sharedInterpolation);

      // Start setting up the shared interpolation
      sharedInterpolation.setupPromise = setupSharedInterpolation(
        sharedInterpolation,
        ownerItem,
        overriddenFromStyle,
      );
    } else if (sharedInterpolatorContext) {
      // Walk up the tree to find parent root and start shared
      // interpolation from there.
      sharedInterpolatorContext.registerSharedInterpolation(
        item,
        fromLabel,
        toLabel,
        animation,
        onBegin,
        onEnd,
      );
    } else {
      throw fluidException(
        "No container found for shared element transition. " +
          "Remember to wrap shared elements in a parent Fluid.View.",
      );
    }
  };

  const setupPendingTransitions = () => {
    // Handle pending shared transitions
    const pendingSharedTransitions = sharedInterpolations.current.filter(
      p => p.status === SharedInterpolationStatus.Created,
    );

    // Skip all logic if we don't have any pending transitions
    if (pendingSharedTransitions.length === 0) return;

    // Mark as preparing
    pendingSharedTransitions.forEach(
      si => (si.status = SharedInterpolationStatus.Preparing),
    );

    // Wait for all shared transitions to be set up
    const promises = pendingSharedTransitions.map(s => s.setupPromise);
    if (pendingSharedTransitions.length > 0) {
      Promise.all(promises).then(async () => {
        // Update status to active
        pendingSharedTransitions.forEach(
          si => (si.status = SharedInterpolationStatus.Active),
        );
        forceUpdate();
      });
    }
  };

  const removeOverwrittenTransitions = () => {
    let shouldForceUpdate = false;
    sharedInterpolations.current.forEach(si => {
      if (
        si.status === SharedInterpolationStatus.Active &&
        hasOverwrittenTransition(si, sharedInterpolations.current)
      ) {
        si.status = SharedInterpolationStatus.Done;
        shouldForceUpdate = true;
      }
    });
    if (shouldForceUpdate) {
      forceUpdate();
    }
  };

  const removeDeadTransitions = () => {
    sharedInterpolations.current = sharedInterpolations.current.filter(
      p => p.status !== SharedInterpolationStatus.Done,
    );
  };

  useEffect(() => {
    removeOverwrittenTransitions();
    // Lets skip out here to avoid setting up async contexts in functions below
    if (
      sharedInterpolations.current.filter(
        p => p.status === SharedInterpolationStatus.Created,
      ).length === 0
    ) {
      return;
    }
    // Otherwise lets start setting up shared transitions
    setupPendingTransitions();
  });

  // Find elements to render
  let sharedElementsToRender = sharedInterpolations.current.filter(
    p =>
      p.status === SharedInterpolationStatus.Active ||
      p.status === SharedInterpolationStatus.Removing,
  );

  // Remove elements that have status Died
  removeDeadTransitions();

  // Add states
  const transitionStates = getStates(
    sharedInterpolationInfos,
    sharedInterpolations.current,
  );

  if (transitionStates.length > 0) {
    console.log(
      transitionStates.map(s => `${s.name} (${s.active ? 1 : 0})`).join(", "),
    );
  }

  stateContext.states = [...stateContext.states, ...transitionStates];

  const renderSharedOverlay = (
    Component: any,
    props: any,
    hasChildren: boolean,
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
            staticStyle={styles.overlayContainer}
            config={createConfig({ childAnimation: { type: "parallel" } })}>
            {sharedElementsToRender.map(c => [c.toClone, c.fromClone])}
          </TransitionView>
        )}
      </Component>
    );
  };

  return {
    renderSharedOverlay,
    sharedInterpolationContext: {
      registerSharedInterpolation,
      registerSharedInterpolationInfo,
    },
  };
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    // overflow: "hidden"
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "#00FF0044",
    // backgroundColor: "#00FF0022",
  },
});

const decorateConfiguration = (
  sharedTransitionStateName: string,
  configuration: SafeStateConfigType,
) => {
  configuration.onEnter.push({
    state: sharedTransitionStateName,
    animation: {
      type: "timing",
      duration: 100,
    },
    interpolation: {
      styleKey: "opacity",
      inputRange: [0, 0.999, 1],
      outputRange: [1, 0, 0],
    },
  });
  configuration.onExit.push({
    state: sharedTransitionStateName,
    animation: {
      type: "timing",
      duration: 100,
    },
    interpolation: {
      styleKey: "opacity",
      inputRange: [0, 0.001, 1],
      outputRange: [0, 1, 1],
    },
  });
};

const hasOverwrittenTransition = (
  si: SharedInterpolationType,
  sharedInterpolations: SharedInterpolationType[],
): boolean => {
  return (
    sharedInterpolations.find(
      p =>
        p !== si &&
        p.status === SharedInterpolationStatus.Active &&
        ((p.fromLabel === si.fromLabel && p.toLabel === si.toLabel) ||
          (p.fromLabel === si.toLabel && p.toLabel === si.fromLabel)),
    ) !== undefined
  );
};
