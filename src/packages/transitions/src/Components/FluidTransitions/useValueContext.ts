import { useRef } from "react";

import {
  TransitionItem,
  ValueContextType,
  AnimationContextType,
  OnAnimationFunction,
  InterpolationInfo,
  Values,
  ValueTypeEntries,
  getNextInterpolationInfoId,
} from "../Types";
import {
  IAnimationNode,
  InterpolationConfig,
  ExtrapolateType,
} from "react-native-fluid-animations";
import { useLog } from "../../Hooks/useLog";
import { getChangedKeys, addValues, createValue } from "../../Values";
import { LoggerLevel, fluidException, ValueDescriptorsType } from "../../Types";
import { ConfigAnimationType } from "../../Configuration";
import { getOutputRange } from "../../Values/getOutputRange";
import { getInputRange } from "../../Values/getInputRange";

/**
 *
 * @description Exposes a value context that contains interpolators for all
 * values
 */
export const useValueContext = (
  transitionItem: TransitionItem,
  animationContext: AnimationContextType,
  valueDescriptors: ValueDescriptorsType,
  nextKeys: string[],
  nextValues: Values,
) => {
  // Contains the previous keys
  const previousKeysRef = useRef<string[]>([]);

  // Contains the previous regular values
  const previousValuesRef = useRef<Values>({});

  // Contains the current interpolated values
  const valuesRef = useRef<ValueTypeEntries>({});

  // Context reference
  const valueContextRef = useRef<ValueContextType>();

  const isChanged = useRef(false);
  isChanged.current = false;

  // @ts-ignore
  const logger = useLog(transitionItem.label, "stctx");

  if (
    valueContextRef.current === undefined ||
    nextValues !== previousValuesRef.current
  ) {
    isChanged.current = valueContextRef.current !== undefined;

    // Added/removed style keys
    const { added } = getChangedKeys(nextKeys, previousKeysRef.current);

    // Update added/removed style values
    added.forEach(k =>
      addValues(k, nextValues, valuesRef.current, valueDescriptors[k]),
    );
    // It looks like we don't need to do this:
    // removed.forEach(k => {
    //   // We mark as not set to be able to reuse
    //   valuesRef.current[k].isSet = false;
    // });

    const markAsChanged = () => (isChanged.current = true);

    /**
     *
     */
    const addInterpolation = (
      interpolator: IAnimationNode,
      key: string,
      inputValues: Array<number> | undefined,
      outputValues: Array<string | number>,
      extrapolate?: ExtrapolateType,
      extrapolateLeft?: ExtrapolateType,
      extrapolateRight?: ExtrapolateType,
      loop?: number,
      flip?: number,
      yoyo?: number,
    ) => {
      // Check that we are allowed to interpolate this style - otherwise
      // We'll just skip it.
      if (!valueDescriptors[key]) {
        return;
      }

      markAsChanged();

      if (outputValues !== undefined) {
        if (outputValues.length < 2) {
          throw fluidException(
            "Output value must contain at least 2 elements.",
          );
        }

        // TODO: Check that input is in ascending range

        // Check if the key exists in our list of styles interpolations
        if (!valuesRef.current[key]) {
          valuesRef.current[key] = createValue(
            outputValues[0],
            valueDescriptors[key],
          );
        }

        // Resolve input range
        let inputRange = new Array<number>(outputValues.length);
        if (inputValues === undefined) {
          outputValues.forEach(
            (_, index) =>
              (inputRange[index] = index * (1 / outputValues.length)),
          );
        } else {
          inputValues.forEach((v, index) => (inputRange[index] = v));
        }

        let outputRange = new Array<number | string>(outputValues.length);
        outputValues.forEach(
          (_, index) =>
            (outputRange[index] = valueDescriptors[key].getNumericValue(
              outputValues[index],
            )),
        );

        // We should create an animation using interpolators
        // Let us set up interpolation!
        const interpolationConfig: InterpolationConfig = {
          inputRange,
          outputRange,
          extrapolate,
          extrapolateLeft,
          extrapolateRight,
        };

        const interpolationInfo: InterpolationInfo = {
          id: getNextInterpolationInfoId(),
          itemId: transitionItem.id,
          key,
          label: transitionItem.label,
          interpolator: valuesRef.current[key].interpolator,
          interpolationConfig,
          interpolate: valueDescriptors[key].interpolate,
          loop,
          flip,
          yoyo,
        };

        if (__DEV__) {
          logger(
            () => `Register interpolation for ${key}.`,
            LoggerLevel.Verbose,
          );
        }

        // Register
        animationContext.registerInterpolation(interpolator, interpolationInfo);
      }
    };

    /**
     *
     */
    // const removeInterpolation = () => {};

    /**
     * @description Adds an animation for a given stylekey
     * @param key
     * @param inputValues
     * @param outputValues
     * @param animationType
     * @param onAnimationBegin
     * @param onAnimationDone
     * @param extrapolate
     * @param extrapolateLeft
     * @param extrapolateRight
     * @param loop
     */
    const addAnimation = (
      key: string,
      inputRange: Array<number> | undefined,
      outputRange: Array<string | number | undefined>,
      animationType?: ConfigAnimationType,
      onAnimationBegin?: OnAnimationFunction,
      onAnimationDone?: OnAnimationFunction,
      extrapolate?: ExtrapolateType,
      extrapolateLeft?: ExtrapolateType,
      extrapolateRight?: ExtrapolateType,
      loop?: number,
      flip?: number,
      yoyo?: number,
    ) => {
      // Check that we are allowed to interpolate this style - otherwise
      // We'll just skip it.
      if (!valueDescriptors[key]) {
        return;
      }

      markAsChanged();

      // Check if the key exists in our list of styles interpolations
      if (!valuesRef.current[key]) {
        valuesRef.current[key] = createValue(
          outputRange[0] !== undefined
            ? outputRange[0]
            : valueDescriptors[key].defaultValue,
          valueDescriptors[key],
        );
      }

      // Get output range
      const outputRangeResolved = getOutputRange(
        outputRange,
        valuesRef.current[key].interpolator,
      ).map(v => valueDescriptors[key].getNumericValue(v));

      // get input range
      const inputRangeResolved = getInputRange(inputRange, outputRangeResolved);

      // Create interpolation
      const resolvedAnimation =
        animationType || valueDescriptors[key].defaultAnimation;

      // Let us set up interpolation!
      const interpolationConfig: InterpolationConfig = {
        inputRange: inputRangeResolved,
        outputRange: outputRangeResolved,
        extrapolate: extrapolate || "extend",
        extrapolateLeft: extrapolateLeft || extrapolate || "extend",
        extrapolateRight: extrapolateRight || extrapolate || "extend",
      };

      const interpolationInfo: InterpolationInfo = {
        id: getNextInterpolationInfoId(),
        itemId: transitionItem.id,
        key,
        label: transitionItem.label,
        interpolator: valuesRef.current[key].interpolator,
        interpolationConfig,
        animationType: resolvedAnimation,
        onBegin: onAnimationBegin,
        onEnd: onAnimationDone,
        loop,
        flip,
        yoyo,
        interpolate: valueDescriptors[key].interpolate,
      };

      if (__DEV__) {
        logger(() => "Register animation for " + key, LoggerLevel.Verbose);
        logger(
          () => `from/to ${interpolationConfig.outputRange.join(", ")}`,
          LoggerLevel.Detailed,
        );
      }

      // Register
      animationContext.registerAnimation(interpolationInfo);
    };

    // Set up next style context
    valueContextRef.current = {
      previousKeys: previousKeysRef.current,
      previousValues: previousValuesRef.current,
      nextValues: nextValues,
      nextKeys: nextKeys,
      current: () => valuesRef.current,
      descriptors: valueDescriptors,
      isChanged: isChanged.current,
      addAnimation,
      addInterpolation,
    };

    // Remember keys/styles
    previousKeysRef.current = nextKeys;
    previousValuesRef.current = nextValues;
  }

  // Return cached style
  return valueContextRef.current;
};
