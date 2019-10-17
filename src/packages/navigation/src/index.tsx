import React, { useContext, useMemo, useState, useCallback } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import { TransitionContext } from "@react-navigation/stack/src/utils/StackGestureContext";
import {
  createFluidComponent,
  StateContext,
  useFluidState,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { AnimationProvider } from "react-native-fluid-animations";

/**
StackGestureContext.tsx:
export const TransitionContext = React.createContext<any>(undefined);

Card.tsx:
<TransitionContext.Provider
  value={{
    isClosing: this.isClosing,
    distance: this.distance,
    active: this.props.active,
    isSwiping: this.isSwiping,
    position: this.transitionState.position,
    current: this.props.current,
    clock: this.clock,
    focused: !this.props.accessibilityElementsHidden,
  }}>
  ...
</TransitionContext.Provider>

 */

export const FluidNavigationContainer: React.FC = ({ ...props }) => {
  const [isNavigating, setIsNavigating] = useFluidState(false);
  const [isSwiping, setIsSwiping] = useFluidState(false);
  const [isClosing, setIsClosing] = useFluidState(false);

  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);

  const current = useMemo(() => new Animated.Value(1), []);
  const fromNext = useMemo(() => new Animated.Value(1), []);

  const doCall = useCallback(
    (value: Animated.Node<any>, cb: (v: number) => void) => {
      return Animated.call([value], (args: ReadonlyArray<number>) =>
        cb(args[0]),
      );
    },
    [],
  );

  const onChange = useCallback(
    (value: Animated.Node<any>, node: Animated.Node<any>) => {
      if (!value) return [];
      return Animated.onChange(value, node);
    },
    [],
  );

  const exec = useMemo(
    () =>
      Animated.block([
        onChange(
          transitionContext.current,
          Animated.block([
            Animated.set(fromNext, 0),
            Animated.set(
              current,
              Animated.cond(
                Animated.eq(transitionContext.isClosing, 1),
                transitionContext.current,
                transitionContext.current,
              ),
            ),
          ]),
        ),
        onChange(
          transitionContext.next,
          Animated.block([
            Animated.set(fromNext, 1),
            Animated.set(current, transitionContext.next),
          ]),
        ),
        onChange(
          transitionContext.isSwiping,
          doCall(transitionContext.isSwiping, (v: number) => {
            setIsSwiping(v as any);
          }),
        ),
        onChange(
          transitionContext.isClosing,
          doCall(transitionContext.isClosing, (v: number) => {
            setIsClosing(v as any);
          }),
        ),
      ]),
    [
      onChange,
      fromNext,
      transitionContext,
      current,
      doCall,
      setIsSwiping,
      setIsClosing,
    ],
  );

  class NavigationComponent extends React.PureComponent<{}> {
    render() {
      const { children } = this.props;
      return (
        <View style={StyleSheet.absoluteFill}>
          {children}
          <Animated.Code key={"navigation"} exec={exec} />
        </View>
      );
    }
  }

  const Component = useMemo(
    () =>
      createFluidComponent<{}, ViewStyle>(NavigationComponent, true, () => ({
        interpolators: {
          current: current,
          fromNext: fromNext,
        },
        props: {},
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const states = [
    ...(stateContext ? stateContext.states : []),
    { name: "navigating", active: isNavigating.active },
    { name: "swiping", active: isSwiping.active },
    { name: "isClosing", active: isClosing.active },
    {
      name: "isFocused",
      active: transitionContext.focused,
      negated: { name: "isNotFocused", active: !transitionContext.focused },
    },
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component label="navigation" {...props} />
    </StateContext.Provider>
  );
};
