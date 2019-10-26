import React from "react";
import Fluid from "react-native-fluid-transitions";
import { useHorizontalTransition } from "react-native-fluid-navigation";
import { Dimensions, StyleSheet } from "react-native";

type BubbleProps = {
  color: string;
};

export const Bubble: React.FC<BubbleProps> = ({ color }) => {
  const horizontalTransition = useHorizontalTransition(
    30 + Dimensions.get("screen").width / 2,
  );

  return (
    <Fluid.View
      config={horizontalTransition}
      staticStyle={[styles.container, { backgroundColor: color }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 20,
  },
});
