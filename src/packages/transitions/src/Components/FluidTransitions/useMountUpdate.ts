import { useEffect, useRef, useContext } from "react";
import { StateContext, AnimationContext, TransitionItem } from "../Types";
import * as Constants from "../../Types";
import { useForceUpdate } from "../../Hooks/useForceUpdate";
import { useLog } from "../../Hooks/useLog";
import { StateMounted } from "../../Types";
import { SafeStateConfigType } from "../../Configuration";

export const useMountUpdate = (
  transitionItem: TransitionItem,
  configuration: SafeStateConfigType
) => {
  const statesContext = useContext(StateContext);
  const forceUpdate = useForceUpdate();
  const context = useContext(AnimationContext);
  const logger = useLog(transitionItem.label, "mount");
  const isMounted = useRef(false);

  // Resolve states
  configuration.states.push({
    name: Constants.StateMounted,
    active: isMounted.current
  });
  configuration.states.push({
    name: Constants.StateUnmounted,
    active: !isMounted.current
  });

  useEffect(() => {
    if (!isMounted.current) {
      // Mark as mounted
      isMounted.current = true;

      // Check if parent context is already mounted
      // @TODO: Would it be better to signal parent to avoid
      // running in sepearate contexts?
      if (
        statesContext &&
        statesContext.states.find(
          p => p.name === StateMounted && p.active === true
        )
      ) {
        if (checkForMounted(transitionItem)) {
          if (__DEV__) {
            logger(() => "Force separate mounted");
          }
          forceUpdate();
        }
        return;
      }

      if (context && context.isInAnimationContext()) {
        // let parent handle this
        return;
      }

      if (checkForMounted(transitionItem)) {
        // Force update - this instance owns the animation context now
        if (__DEV__) {
          logger(() => "Updating from unmounted -> mounted state");
        }
        forceUpdate();
      }
    }
  }, []);

  return isMounted.current;
};

const checkForMounted = (transitionItem: TransitionItem) => {
  const configuration = transitionItem.configuration();
  if (configuration.when.find(w => w.state === StateMounted)) return true;
  if (configuration.onEnter.find(o => o.state === StateMounted)) return true;
  if (configuration.onExit.find(o => o.state === StateMounted)) return true;

  const children = transitionItem.children();
  let retVal = false;
  children.forEach(ti => {
    if (checkForMounted(ti)) {
      retVal = true;
    }
  });
  return retVal;
};
