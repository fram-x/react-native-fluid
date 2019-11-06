import React from "react";
import { StyleSheet } from "react-native";
import Fluid, {
  useFluidConfig,
  AnimationType,
  OnEnterState,
  WhenState,
} from "react-native-fluid-transitions";

type Props = {
  label: string;
  color: string;
  active: boolean;
};

const Bubble: React.FunctionComponent<Props> = ({ label, color, active }) => {
  const activeState = { name: "active", active };
  const config = useFluidConfig(
    AnimationType(Fluid.Animations.Springs.Gentle),
    WhenState(activeState, {
      opacity: 0,
      transform: [{ scale: 0.009 }, { translateY: -64 }],
    }),
    OnEnterState(Fluid.States.Mounted, {
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1],
      styleKey: "transform.scaleY",
    }),
  );

  return (
    <Fluid.View
      label={"inner-" + label}
      initialStyle={styles.containerInitialStyle}
      states={activeState}
      config={config}
      staticStyle={[styles.container, { backgroundColor: color }]}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    opacity: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 10,
  },
  containerInitialStyle: {
    opacity: 0,
    transform: [{ scale: 0.009 }, { translateY: -64 }],
  },
});

export { Bubble };
