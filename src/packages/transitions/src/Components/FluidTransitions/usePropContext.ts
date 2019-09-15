import { useRef } from "react";
import { TransitionItem, AnimationContextType, Values } from "../Types";
import { ValueDescriptorsType } from "../../Types";
import { useValueContext } from "./useValueContext";
import { getAnimatedProps } from "../../Props";
import { IAnimationNode } from "react-native-fluid-animations";

export const usePropContext = <T extends Values>(
  transitionItem: TransitionItem,
  animationContext: AnimationContextType,
  props: T,
  valueDescriptors: ValueDescriptorsType
) => {
  // Contains previous prop values for descriptors
  const previousPropsRef = useRef<T>();

  // Current animated props
  const animatedPropsRef = useRef<{ [key: string]: IAnimationNode }>();

  if (previousPropsRef.current !== props) {
    // Update
    previousPropsRef.current = props;
  }

  const nextKeys = Object.keys(props);
  const nextValues: Values = {};
  nextKeys.forEach(key => (nextValues[key] = props[key]));

  // Create value context
  const valueContext = useValueContext(
    transitionItem,
    animationContext,
    valueDescriptors,
    nextKeys,
    nextValues
  );

  if (valueContext.isChanged) {
    // Reset props
    animatedPropsRef.current = undefined;
  }

  const getAnimatedPropsInternal = () => {
    if (!animatedPropsRef.current) {
      animatedPropsRef.current = getAnimatedProps(valueContext.current());
    }
    return animatedPropsRef.current;
  };

  return {
    getAnimatedProps: getAnimatedPropsInternal,
    propContext: valueContext
  };
};
