import { useRef } from "react";
import { StyleSheet } from "react-native";
import {
  Style,
  TransitionItem,
  AnimationContextType,
  AnimatedStyleKeys
} from "../Types";
import { getCalulatedStyles } from "../../Styles/getCalculatedStyle";
import { useValueContext } from "./useValueContext";
import { getStyleInfo } from "../../Styles/getStyleInfo";

/**
 *
 * @description Builds a hash table of styles that is when interpolating
 */
export const useStyleContext = (
  transitionItem: TransitionItem,
  animationContext: AnimationContextType,
  currentStyle: Style[] | Style | number | undefined
) => {
  // Contains the last calculated style
  const calculatedStyleRef = useRef<Style>();

  const styleRef = useRef<Style | Style[] | number | undefined>();
  const styleResolvedRef = useRef<Style | Style[]>();
  if (styleRef.current !== currentStyle) {
    styleRef.current = currentStyle;
    styleResolvedRef.current = StyleSheet.flatten(currentStyle as any);
  }

  // Getting values from the next style
  const { styleKeys, styleValues } = getStyleInfo(styleResolvedRef.current);

  // Create context
  const valueContext = useValueContext(
    transitionItem,
    animationContext,
    AnimatedStyleKeys,
    styleKeys,
    styleValues
  );

  if (valueContext.isChanged) {
    // Reset style
    calculatedStyleRef.current = undefined;
  }

  const getCalculatedStylesCached = () => {
    if (!calculatedStyleRef.current) {
      calculatedStyleRef.current = getCalulatedStyles(valueContext.current());
    }
    return calculatedStyleRef.current;
  };

  // Return context values
  return {
    getCalculatedStyles: getCalculatedStylesCached,
    styleContext: valueContext
  };
};
