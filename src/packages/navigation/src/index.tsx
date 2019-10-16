import React, { useContext, useMemo, useState, useCallback } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import { TransitionContext } from "@react-navigation/stack/src/utils/StackGestureContext";
import {
  createFluidComponent,
  StateContext,
  useFluidState,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";

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
  }}>
  ...
</TransitionContext.Provider>

 */

let NavId = 1;
export const FluidNavigationContainer: React.FC = ({ ...props }) => {
  const [isNavigating, setIsNavigating] = useFluidState(false);
  const [isSwiping, setIsSwiping] = useFluidState(false);
  const [isClosing, setIsClosing] = useFluidState(false);

  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);
  const [navigationId] = useState(() => NavId++);
  const onChange = useCallback(
    (
      msg: string,
      value: Animated.Node<any>,
      cb: (s: string, v: number) => void,
    ) => {
      if (!value) return [];
      return Animated.onChange(value, [
        Animated.call([value], (args: ReadonlyArray<number>) =>
          cb(msg + " " + navigationId, args[0]),
        ),
      ]);
    },
    [navigationId],
  );

  const exec = useMemo(
    () =>
      Animated.block([
        onChange("current", transitionContext.current, console.log),
        onChange("isSwiping", transitionContext.isSwiping, (_, v: number) => {
          setIsSwiping(v as any);
        }),
        onChange("isClosing", transitionContext.isClosing, (_, v: number) => {
          setIsClosing(v as any);
        }),
        onChange(
          "isAnimating",
          Animated.clockRunning(transitionContext.clock),
          (_, v: number) => {
            setIsNavigating(v as any);
          },
        ),
      ]),
    [onChange, transitionContext, setIsSwiping, setIsClosing, setIsNavigating],
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
          progress: transitionContext.current,
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
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component label="navigation" {...props} />
    </StateContext.Provider>
  );
};
