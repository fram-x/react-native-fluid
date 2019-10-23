import React, { useContext, useMemo, useState } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import TransitionContext from "@react-navigation/stack/src/utils/TransitionContext";
import {
  createFluidComponent,
  StateContext,
  DriverContext,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { AnimationProvider } from "react-native-fluid-animations";
import { DriverContextType } from "src/packages/transitions/src/Components/Types";

export enum NavigationState {
  None = "None",
  ForwardTo = "ForwardTo",
  ForwardFrom = "ForwardFrom",
  BackTo = "BackTo",
  BackFrom = "BackFrom",
}

export const NavigationTiming = 2000;

type Props = {
  name: string;
};

export const FluidNavigationContainer: React.FC<Props> = ({
  name,
  ...props
}) => {
  const [duration, setDuration] = useState(1);

  // Context
  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);

  if (!transitionContext) throw Error("No transition context found.");

  // Animation interpolator
  const current = useMemo(() => new Animated.Value(1), []);

  // Driver context
  const driverContextValue = useMemo<DriverContextType>(
    () => ({
      isActive: () => transitionContext.inTransition,
      driver: current,
      requestDuration: setDuration,
    }),
    [current, transitionContext.inTransition],
  );

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
          Animated.neq(isForwardValue, 1),
          // AnimationProvider.Animated.debug(
          //   "backwards " + name,
          Animated.set(
            current,
            Animated.sub(
              1,
              Animated.divide(
                transitionContext.progress,
                Animated.divide(NavigationTiming, duration),
              ),
            ),
          ),
          // ) as any,
          // AnimationProvider.Animated.debug(
          //   "forward " + name,
          Animated.set(current, transitionContext.progress),
          //),
        ),
      ),
    [transitionContext.progress, isForwardValue, current, duration],
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

  // const navigation = useNavigation();
  // const [inTransition, setInTransition] = useState(false);
  // const onTransitionStart = () => setInTransition(true);
  // const onTransitionEnd = () => setInTransition(false);
  // useEffect(() => {
  //   navigation.addListener("transitionStart", onTransitionStart);
  //   navigation.addListener("transitionEnd", onTransitionEnd);
  //   return () => {
  //     navigation.removeListener("transitionStart", onTransitionStart);
  //     navigation.removeListener("transitionEnd", onTransitionEnd);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

  console.log(name, driverContextValue.isActive(), navigationState);

  // Render
  return (
    <DriverContext.Provider value={driverContextValue}>
      <StateContext.Provider value={{ states }}>
        <Component label="navigation" {...props} />
      </StateContext.Provider>
    </DriverContext.Provider>
  );
};
