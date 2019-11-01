import { useRef, useContext, useEffect, useCallback } from "react";
import {
  InterpolatorContext,
  InterpolatorInfo,
  PartialInterpolatorInfo,
} from "../Types";
import { useForceUpdate } from "../../Hooks";
import { fluidException } from "../../Types";

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

  const interpolatorEntries = useRef<Array<InterpolatorInfo>>([]);
  const interpolatorEntry = useRef<InterpolatorInfo | undefined>(undefined);
  const isMounted = useRef(false);
  const hasInterpolatorRequest = useRef(false);

  const forceUpdate = useForceUpdate();

  const context = useContext(InterpolatorContext);

  if (setupInterpolators && !interpolatorEntry.current) {
    if (!label) {
      throw fluidException(
        "All components exposing interpolators must be named through the label property.",
      );
    }
    interpolatorEntry.current = {
      label: label,
      ...setupInterpolators(props),
    };
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
    },
    [context],
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
    if (isMounted.current) {
      throw fluidException(
        "Could not find interpolator " + lbl + "." + name + ".",
      );
    } else {
      return undefined;
    }
  };

  useEffect(() => {
    isMounted.current = true;
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
