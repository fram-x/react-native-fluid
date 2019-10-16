import React, { useMemo, useEffect, useState, useRef } from "react";
import { Easing, View, Animated, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fluid, { useFluidState } from "react-native-fluid-transitions";
import { useFluidConfig } from "react-native-fluid-transitions";

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 40,
    backgroundColor: "pink",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  activeContainer: {
    width: 100,
    height: 100,
    backgroundColor: "gold",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export const MySimpleComponent: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  const toggleActive = () => setActive(p => !p);
  return (
    <TouchableOpacity onPress={toggleActive}>
      <View style={active ? styles.activeContainer : styles.container}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export const MyFluidComponent: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  const toggleActive = () => setActive(p => !p);
  return (
    <Fluid.View
      onPress={toggleActive}
      style={active ? styles.activeContainer : styles.container}>
      {children}
    </Fluid.View>
  );
};

export const MyFluidStateComponent: React.FC = ({ children }) => {
  const [active, setActive] = useFluidState(true);
  const [inactive, setInactive] = useFluidState(true);
  const config = useFluidConfig({
    onEnter: {
      state: active,
      interpolation: {
        styleKey: "transform.scale",
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
      },
    },
    when: [
      {
        state: active,
        style: styles.activeContainer,
      },
      { state: inactive, style: styles.container },
    ],
  });

  const toggleActive = () => {
    setActive(p => !p);
    setInactive(p => !p);
  };

  return (
    <Fluid.View onPress={toggleActive} config={config} states={active}>
      {children}
    </Fluid.View>
  );
};

export const MyComponent: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  const animationRef = useRef<Animated.CompositeAnimation>();
  const animationValue = useMemo(() => new Animated.Value(0), []);

  const animatedStyle = useMemo(
    () => ({
      height: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 40],
      }),
      borderRadius: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 0],
      }),
      backgroundColor: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["gold", "pink"],
        extrapolate: "clamp",
      }),
    }),
    [animationValue],
  );

  const toggleActive = () => setActive(p => !p);
  useEffect(() => {
    if (animationRef.current !== undefined) {
      animationRef.current.stop();
      animationRef.current = undefined;
    }
    animationRef.current = Animated.timing(animationValue, {
      toValue: active ? 0 : 1,
      duration: 550,
      easing: Easing.cubic,
    });
    animationRef.current.start(() => {
      animationRef.current = undefined;
    });
  }, [active, animationValue]);

  return (
    <TouchableOpacity onPress={toggleActive}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
