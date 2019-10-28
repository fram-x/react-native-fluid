import React from "react";
import Fluid from "react-native-fluid-transitions";
import { useHorizontalTransition } from "react-native-fluid-navigation";
import { Dimensions, StyleSheet } from "react-native";

type Props = {
  color: string;
};

export const Box: React.FC<Props> = ({ color }) => {
  const horizontalTransition = useHorizontalTransition(
    Dimensions.get("screen").width,
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
    width: 40,
    height: 40,
    margin: 10,
  },
});
