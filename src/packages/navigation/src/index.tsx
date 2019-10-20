import React, { useContext, useMemo, useEffect, useState } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import { TransitionContext } from "@react-navigation/stack/src/utils/StackGestureContext";
import {
  createFluidComponent,
  StateContext,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/core";

export enum NavigationState {
  None = "None",
  ForwardTo = "ForwardTo",
  ForwardFrom = "ForwardFrom",
  BackTo = "BackTo",
  BackFrom = "BackFrom",
}

/**
StackGestureContext.tsx:
export const TransitionContext = React.createContext<any>(undefined);

Stack.tsx#416:
<TransitionContext.Provider
  value={{
    progress: progress[focusedRoute.key],
    index: index,
    inTransition: this.state.inTransition,
    isForward: closingRouteKeys.length === 0,
    active: route.key === focusedRoute.key,
  }}>   
  ...
</TransitionContext.Provider>
 */

export const FluidNavigationContainer: React.FC = ({ ...props }) => {
  // Context
  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);

  if (!transitionContext) throw Error("No transition context found.");

  // Animation interpolator
  const current = useMemo(() => new Animated.Value(1), []);

  // Animated value for is forward
  const isForwardValue = useMemo(
    () => new Animated.Value(transitionContext.isForward ? 1 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Update to reflect current state
  isForwardValue.setValue(transitionContext.isForward ? 1 : 0);

  const exec = useMemo(
    () =>
      Animated.onChange(
        transitionContext.progress,
        Animated.cond(
          Animated.eq(isForwardValue, 1),
          // AnimationProvider.Animated.debug(
          //   "forward",
          Animated.set(current, transitionContext.progress),
          // ),
          // AnimationProvider.Animated.debug(
          //   "backwards",
          Animated.set(current, Animated.sub(1, transitionContext.progress)),
          // ) as any,
        ),
      ),
    [transitionContext.progress, isForwardValue, current],
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
        },
        props: {},
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const navigation = useNavigation();
  const [inTransition, setInTransition] = useState(false);
  const onTransitionStart = () => setInTransition(true);
  const onTransitionEnd = () => setInTransition(false);
  useEffect(() => {
    navigation.addListener("transitionStart", onTransitionStart);
    navigation.addListener("transitionEnd", onTransitionEnd);
    return () => {
      navigation.removeListener("transitionStart", onTransitionStart);
      navigation.removeListener("transitionEnd", onTransitionEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigationState = !transitionContext.inTransition
    ? NavigationState.None
    : transitionContext.isForward
    ? transitionContext.active
      ? NavigationState.ForwardTo
      : NavigationState.ForwardFrom
    : transitionContext.active
    ? NavigationState.BackTo
    : NavigationState.BackFrom;

  const states = [
    ...(stateContext ? stateContext.states : []),
    {
      name: "navigationState",
      active: true,
      value: navigationState,
    },
    {
      name: "isNavigating",
      active: transitionContext.inTransition,
      negated: {
        name: "isNotNavigating",
        active: !transitionContext.inTransition,
      },
    },
    {
      name: "isActive",
      active: transitionContext.active,
      negated: { name: "isNotActive", active: !transitionContext.active },
    },
    {
      name: "isForward",
      active: transitionContext.isForward,
      negated: { name: "isBackward", active: !transitionContext.isForward },
    },
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component label="navigation" {...props} />
    </StateContext.Provider>
  );
};
