import React, { useContext, useMemo } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import TransitionContext from "@react-navigation/stack/src/utils/TransitionContext";
import {
  createFluidComponent,
  StateContext,
  DriverContext,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { useDriverContext } from "./hooks/useDriverContext";
import { useCurrentValue } from "./hooks/useCurrentValue";
import { NavigationState } from "./types";
import { useNavigationState } from "./hooks/useNavigationState";

type Props = {
  name: string;
};

export const FluidNavigationContainer: React.FC<Props> = ({
  name,
  ...props
}) => {
  // Context
  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);

  if (!transitionContext) throw Error("No transition context found.");

  const navigationState = useNavigationState(transitionContext);

  // Current
  const { current, duration } = useCurrentValue(name, transitionContext);

  // Driver context
  const driverContextValue = useDriverContext(
    name,
    navigationState,
    duration,
    current,
  );

  class NavigationComponent extends React.PureComponent<{}> {
    render() {
      const { children } = this.props;
      return <View style={StyleSheet.absoluteFill}>{children}</View>;
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

  const states = [
    ...(stateContext ? stateContext.states : []),
    {
      name: NavigationState.None,
      active: navigationState === NavigationState.None,
    },
    {
      name: NavigationState.ForwardTo,
      active: navigationState === NavigationState.ForwardTo,
    },
    {
      name: NavigationState.ForwardFrom,
      active: navigationState === NavigationState.ForwardFrom,
    },
    {
      name: NavigationState.BackTo,
      active: navigationState === NavigationState.BackTo,
    },
    {
      name: NavigationState.BackFrom,
      active: navigationState === NavigationState.BackFrom,
    },
    {
      name: NavigationState.InTransition,
      active: transitionContext.inTransition,
    },
    {
      name: NavigationState.Focused,
      active: transitionContext.focused,
    },
    {
      name: NavigationState.Forward,
      active: transitionContext.isForward,
    },
    {
      name: NavigationState.Index,
      active: true,
      value: transitionContext.index,
    },
  ];

  // Render
  return (
    <DriverContext.Provider value={driverContextValue}>
      <StateContext.Provider value={{ states }}>
        <Component label="navigation" {...props} />
      </StateContext.Provider>
    </DriverContext.Provider>
  );
};
