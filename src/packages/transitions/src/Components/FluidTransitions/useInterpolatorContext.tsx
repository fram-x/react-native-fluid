import { useRef, useContext, useEffect } from "react";
import {
  InterpolatorContext,
  InterpolatorInfo,
  PartialInterpolatorInfo,
} from "../Types";
import { useForceUpdate } from "../../Hooks";
import * as Constants from "../../Types/Constants";
import { AnimationProvider } from "react-native-fluid-animations";
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

  const interpolatorEntries = useRef(new Array<InterpolatorInfo>());
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

  const registerInterpolator = (interpolatorInfo: InterpolatorInfo) => {
    if (context) {
      context.registerInterpolator(interpolatorInfo);
      return;
    }
    interpolatorEntries.current.push(interpolatorInfo);
  };

  const getInterpolator = (lbl: string, name: string) => {
    // Custom/dummy interpolators
    if (lbl === Constants.InterpolatorLabelRoot) {
      switch (name) {
        case Constants.InterpolatorStatic:
          return AnimationProvider.createValue(1);
      }
    }

    // Check context
    if (context) {
      return context.getInterpolator(lbl, name);
    }

    hasInterpolatorRequest.current = true;
    const interpolatorInfo = interpolatorEntries.current.find(
      ii => ii.label === lbl && ii.interpolators[name] !== undefined,
    );
    if (interpolatorInfo) {
      return interpolatorInfo.interpolators[name];
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
