import { useRef, useContext, useEffect, useCallback } from "react";
import {
  InterpolatorContext,
  InterpolatorInfo,
  PartialInterpolatorInfo,
} from "../Types";
import { useForceUpdate, useLog } from "../../Hooks";
import { LoggerLevel } from "../../Types";

/**
 *
 * @description HOC to share interpolators between parent -> child
 */
export const useInterpolatorContext = (
  label: string | undefined,
  props: any,
  setupInterpolators?: (props: any) => PartialInterpolatorInfo,
) => {
  /******************************************************
   * Setup
   ******************************************************/

  const logger = useLog(label, "ipctx");
  const interpolatorEntries = useRef<Array<InterpolatorInfo>>([]);
  const interpolatorEntry = useRef<InterpolatorInfo | undefined>(undefined);
  const hasUpdated = useRef(false);
  const hasInterpolatorRequest = useRef(false);

  const forceUpdate = useForceUpdate();
  const context = useContext(InterpolatorContext);

  if (setupInterpolators && !interpolatorEntry.current) {
    if (!label) {
      console.warn(
        "All components exposing interpolators must be named through the label property.",
      );
    } else {
      interpolatorEntry.current = {
        label: label,
        ...setupInterpolators(props),
      };
      logger(
        () =>
          "Registered " +
          (interpolatorEntry.current &&
            Object.keys(interpolatorEntry.current.interpolators).join(", ")) +
          " in " +
          label,
        LoggerLevel.Detailed,
      );
    }
  }

  /******************************************************
   * Context
   ******************************************************/

  const registerInterpolator = useCallback(
    (interpolatorInfo: InterpolatorInfo) => {
      if (context) {
        context.registerInterpolator(interpolatorInfo);
        return;
      }
      interpolatorEntries.current.push(interpolatorInfo);
      logger(() => "Registered interpolator through context in " + label);
    },
    [context, label, logger],
  );

  const getInterpolator = (lbl: string, name: string) => {
    // Check context
    if (context) {
      return context.getInterpolator(lbl, name);
    }

    const interpolatorInfo = interpolatorEntries.current.find(
      ii => ii.label === lbl && ii.interpolators[name] !== undefined,
    );
    if (interpolatorInfo) {
      return interpolatorInfo.interpolators[name];
    }
    if (
      interpolatorEntry.current &&
      interpolatorEntry.current.interpolators[name] &&
      label === lbl
    ) {
      return interpolatorEntry.current.interpolators[name];
    }
    // Let's update once to rerender so that the tree is ready
    if (!hasUpdated.current) {
      hasUpdated.current = true;
      forceUpdate();
    }
    return undefined;
  };

  useEffect(() => {
    if (interpolatorEntry.current) {
      registerInterpolator(interpolatorEntry.current);
    }

    // We have mounted - check if anyone has requested any interpolator
    if (hasInterpolatorRequest.current && !context) {
      forceUpdate();
    }
  }, [context, forceUpdate, registerInterpolator]);

  return {
    extraProps: {
      ...(interpolatorEntry.current ? interpolatorEntry.current.props : {}),
    },
    interpolatorContext: context
      ? context
      : {
          getInterpolator: getInterpolator,
          registerInterpolator: registerInterpolator,
        },
  };
};
