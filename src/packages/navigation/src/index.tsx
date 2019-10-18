import React, {
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ViewStyle, StyleSheet, View } from "react-native";
import { TransitionContext } from "@react-navigation/stack/src/utils/StackGestureContext";
import {
  createFluidComponent,
  StateContext,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/core";
import { AnimationProvider } from "react-native-fluid-animations";

/**
StackGestureContext.tsx:
export const TransitionContext = React.createContext<any>(undefined);

Stack.tsx#416:
 <TransitionContext.Provider    
  value={{
    progress: progress[focusedRoute.key],
    isForward: state.index === routes.length - 1,
    index: index,
    isActive: state.index === index,
  }}>    
  ...
</TransitionContext.Provider>
 */

export const FluidNavigationContainer: React.FC = ({ ...props }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const onTransitionStart = () => {
    console.log("Transition begin");
    setIsNavigating(true);
  };
  const onTransitionEnd = () => {
    console.log("Transition end");
    setIsNavigating(false);
  };
  const onBlur = () => setIsFocused(false);
  const onFocus = () => setIsFocused(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener("transitionStart", onTransitionStart);
    navigation.addListener("transitionEnd", onTransitionEnd);
    navigation.addListener("blur", onBlur);
    navigation.addListener("focus", onFocus);

    return () => {
      navigation.removeListener("transitionStart", onTransitionStart);
      navigation.removeListener("transitionEnd", onTransitionEnd);
      navigation.removeListener("blur", onBlur);
      navigation.removeListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);
  const current = useMemo(() => new Animated.Value(1), []);

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
          transitionContext.progress,
          transitionContext.isForward
            ? AnimationProvider.Animated.debug(
                "forward",
                Animated.set(current, transitionContext.progress),
              )
            : (AnimationProvider.Animated.debug(
                "backwards",
                Animated.set(
                  current,
                  Animated.sub(1, transitionContext.progress),
                ),
              ) as any),
        ),
      ]),
    [
      onChange,
      transitionContext.isForward,
      transitionContext.progress,
      current,
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
        },
        props: {},
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const states = [
    ...(stateContext ? stateContext.states : []),
    {
      name: "isNavigating",
      active: isNavigating,
      negated: { name: "isNotNavigating", active: !isNavigating },
    },
    {
      name: "isSwiping",
      active: isSwiping,
      negated: { name: "isNotSwiping", active: !isNavigating },
    },
    {
      name: "isFocused",
      active: isFocused,
      negated: { name: "isNotFocused", active: !isFocused },
    },
    {
      name: "isForward",
      active: transitionContext.isForward,
      negated: { name: "isBackward", active: !transitionContext.isForward },
    },
    {
      name: "isActive",
      active: transitionContext.isActive,
      negated: { name: "isInactive", active: !transitionContext.isActive },
    },
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component label="navigation" {...props} />
    </StateContext.Provider>
  );
};
