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
  useFluidState,
} from "react-native-fluid-transitions";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/core";

/**
StackGestureContext.tsx:
export const TransitionContext = React.createContext<any>(undefined);

Stack.tsx:
<TransitionContext.Provider
  value={{ progress: progress[focusedRoute.key] }}>
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
    navigation.addListener("transitionStart", onTransitionEnd);
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
          Animated.block([
            Animated.set(
              current,
              // Animated.cond(
              //   Animated.eq(transitionContext.isVisible, 0),
              //   Animated.sub(1, transitionContext.progress),
              transitionContext.progress,
            ),
          ]),
        ),
        // onChange(
        //   transitionContext.isSwiping,
        //   doCall(transitionContext.isSwiping, (v: number) => {
        //     setIsSwiping(v as any);
        //   }),
        // ),
      ]),
    [onChange, transitionContext, current],
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
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component label="navigation" {...props} />
    </StateContext.Provider>
  );
};
