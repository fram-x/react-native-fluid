import { useRef, useContext, useEffect, useCallback } from "react";
import {
  InterpolatorContext,
  InterpolatorInfo,
  PartialInterpolatorInfo,
} from "../Types";
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
    console.log(label);
    console.log(interpolatorEntry.current);
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
    throw fluidException(
      "Could not find interpolator " + lbl + "." + name + ".",
    );
  };

  useEffect(() => {
    if (interpolatorEntry.current) {
      registerInterpolator(interpolatorEntry.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
