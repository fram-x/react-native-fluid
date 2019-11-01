import React from "react";
import Fluid, { Easings, useFluidConfig } from "react-native-fluid-transitions";
import { StyleSheet } from "react-native";

type Props = {
  loop: number;
  flip: number;
  yoyo: number;
  color: string;
  isRepeating: boolean;
};
const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 3,
  },
});

export const Repeater: React.FC<Props> = ({
  loop,
  flip,
  yoyo,
  color,
  isRepeating,
}) => {
  const state = { name: "repeat", active: isRepeating };
  const config = useFluidConfig({
    when: {
      animation: {
        type: "timing",
        duration: 1200,
        easing: Easings.back(),
      },
      state: state,
      flip,
      yoyo,
      loop,
      interpolation: {
        outputRange: [-50, 0, 50],
        styleKey: "transform.translateX",
      },
    },
  });
  return (
    <Fluid.View
      label="repeat"
      states={state}
      config={config}
      style={{ transform: [{ translateX: -50 }] }}
      staticStyle={[styles.container, { backgroundColor: color }]}
    />
  );
};
