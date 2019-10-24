import React, { useContext, useMemo, useState } from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import TransitionContext from "@react-navigation/stack/src/utils/TransitionContext";
import {
  createFluidComponent,
  StateContext,
  DriverContextType,
  DriverContext,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { AnimationProvider } from "react-native-fluid-animations";

export enum NavigationState {
  None = "None",
  ForwardTo = "ForwardTo",
  ForwardFrom = "ForwardFrom",
  BackTo = "BackTo",
  BackFrom = "BackFrom",
}

export const NavigationTiming: number = 2000;

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

  // Animation interpolator
  const current = useMemo(() => new Animated.Value(1), []);
  const durationValue = useMemo(() => new Animated.Value(NavigationTiming), []);

  // Driver context
  const driverContextValue = useMemo<DriverContextType>(
    () => ({
      isActive: () => transitionContext.inTransition,
      driver: current,
      requestDuration: (duration: number) => durationValue.setValue(duration),
    }),
    [current, durationValue, transitionContext.inTransition],
  );

  // Animated value for is forward
  const isForwardValue = useMemo(
    () => new Animated.Value(transitionContext.isForward ? 1 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const inTransitionValue = useMemo(
    () => new Animated.Value(transitionContext.inTransition ? 1 : 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Update to reflect current state
  isForwardValue.setValue(transitionContext.isForward ? 1 : 0);
  inTransitionValue.setValue(transitionContext.inTransition ? 1 : 0);

  const updateCurrentValue = useMemo(
    () =>
      Animated.onChange(transitionContext.progress, [
        Animated.cond(Animated.eq(inTransitionValue, 1), [
          Animated.cond(
            Animated.neq(isForwardValue, 1),
            [
              // We are running backwards
              // AnimationProvider.Animated.debug(
              //   "<- " + name + " backwards",
              Animated.set(
                current,
                Animated.divide(
                  Animated.sub(1, transitionContext.progress),
                  Animated.divide(1.0, durationValue),
                ),
              ),
              // ) as any,
            ],
            [
              // We are running forwards
              // AnimationProvider.Animated.debug(
              //   "-> " + name + " forward ",
              Animated.set(
                current,
                Animated.divide(
                  transitionContext.progress,
                  Animated.divide(1.0, durationValue),
                ),
              ),
              // ),
            ],
          ),
        ]),
      ]),
    [
      current,
      durationValue,
      inTransitionValue,
      isForwardValue,
      // name,
      transitionContext.progress,
    ],
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

  console.log(
    name,
    transitionContext.progress.__nodeID,
    "drv:",
    driverContextValue.isActive(),
    "st:",
    navigationState,
    "inTrans:",
    transitionContext.inTransition,
  );

  // Render
  return (
    <DriverContext.Provider value={driverContextValue}>
      <StateContext.Provider value={{ states }}>
        <Component label="navigation" {...props} />
        <Animated.Code exec={updateCurrentValue} />
      </StateContext.Provider>
    </DriverContext.Provider>
  );
};
