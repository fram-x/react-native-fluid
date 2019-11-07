import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import { InterpolationValue } from "react-native-fluid-transitions";
import { Interpolation } from "react-native-fluid-transitions";
import { OnEnterState } from "src/packages/transitions/dist/src/Hooks/onState";
import { useFluidState } from "react-native-fluid-transitions";

const styles = StyleSheet.create({
  activeContainer: {},
  container: {},
  header: {},
});

export const MyComponent: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);

  const [activeState, setActiveState] = useFluidState(false);
  const toggle = () => setActiveState(a => !a);

  const s = toggle;
  const toggleActive = () => setActive(p => !p);

  const cfg = useFluidConfig(
    OnEnterState(activeState, {
      styleKey: "backgroundColor",
      inputRange: [0, 1],
      outputRange: ["pink", "gold"],
    }),
  );

  let g = cfg;

  const animationRef = useRef<Animated.CompositeAnimation>();
  const animatedValue = useMemo(() => new Animated.Value(0), []);
  //   let config = {};

  // return (
  //   <Fluid.View>
  //     <Fluid.View config={config} staticStyle={styles.header}/>
  //     <Fluid.ScrollView label="myScrollView">
  //       {children}
  //     </Fluid.ScrollView>
  //   </Fluid.View>
  // );

  const animatedStyle = useMemo(
    () => ({
      height: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 40],
      }),
      borderRadius: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 0],
      }),
      backgroundColor: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["gold", "pink"],
      }),
    }),
    [animatedValue],
  );

  useEffect(() => {
    if (animationRef.current !== undefined) {
      animationRef.current.stop();
    }

    animationRef.current = Animated.timing(animatedValue, {
      toValue: active ? 0 : 1,
      duration: 550,
      easing: Easing.cubic,
    });

    animationRef.current.start(() => {
      animationRef.current = undefined;
    });
  }, [active, animatedValue]);

  const value = InterpolationValue("myScrollView", "scrollY");
  const config = useFluidConfig(
    Interpolation(value, {
      inputRange: [0, 10],
      outputRange: [1, 1.1],
      styleKey: "transform.scale",
    }),
  );

  return (
    <Fluid.ScrollView label="myScrollView">
      <Fluid.View config={config} staticStyle={styles.container}>
        {children}
      </Fluid.View>
    </Fluid.ScrollView>
  );
};
