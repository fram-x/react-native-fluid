import React, { useState, useRef, useMemo, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View, StyleSheet, Animated, Easing } from "react-native";

const styles = StyleSheet.create({
  activeContainer: {},
  container: {},
});

export const MyComponent: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  const toggleActive = () => setActive(p => !p);

  const animationRef = useRef<Animated.CompositeAnimation>();
  const animatedValue = useMemo(() => new Animated.Value(0), []);

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

  return (
    <TouchableOpacity onPress={toggleActive}>
      <View style={active ? styles.activeContainer : styles.container}>
        {children}      
      </View>
    </TouchableOpacity>
  );
};
