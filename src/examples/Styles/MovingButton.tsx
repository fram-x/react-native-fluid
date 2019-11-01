import React from "react";
import { StyleSheet, Text } from "react-native";
import Fluid, { useFluidState } from "react-native-fluid-transitions";
import * as Colors from "../colors";
import { useMergedConfigs } from "react-native-fluid-transitions";
import { WhenState, AnimationType } from "react-native-fluid-transitions";

const MovingButton: React.FunctionComponent<{}> = () => {
  const [activeState, setActive] = useFluidState(false);
  const [pressedState, setPressed] = useFluidState(false);

  const notToggledState = { name: "nottoggled", active: !activeState.active };

  const onToggle = () => setActive(a => !a);
  const onPressIn = () => setPressed(true);
  const onPressOut = () => setPressed(false);

  const config = useMergedConfigs(
    AnimationType(Fluid.Animations.Springs.WobblySlow),
    WhenState(pressedState, styles.pressed, {
      animation: Fluid.Animations.Timings.Default,
    }),
    WhenState(activeState, styles.activeButton),
    WhenState("nottoggled", styles.inactiveButton),
  );

  return (
    <Fluid.View
      label="button"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onToggle}
      states={[activeState, pressedState, notToggledState]}
      config={config}
      initialStyle={styles.initialStyle}
      staticStyle={styles.button}>
      <Text>Tap me!</Text>
    </Fluid.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: Colors.ColorA,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: "white",
  },
  initialStyle: {
    transform: [{ scale: 0.009 }],
  },
  activeButton: {
    transform: [{ rotate: "-15deg" }, { translateX: 100 }],
  },
  inactiveButton: {
    transform: [{ rotate: "15deg" }, { translateX: -100 }],
  },
  pressed: {
    backgroundColor: "#CCC",
  },
});

export default MovingButton;
