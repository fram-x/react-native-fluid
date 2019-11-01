import React from "react";
import { StyleSheet, Text } from "react-native";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import * as Colors from "../colors";

type Props = {
  toggled: boolean;
  onToggle: () => void;
};
const MovingButton: React.FunctionComponent<Props> = ({
  toggled,
  onToggle,
}) => {
  const toggledState = { name: "toggled", active: toggled };
  const notToggledState = { name: "nottoggled", active: !toggled };

  const config = useFluidConfig({
    animation: Fluid.Animations.Springs.WobblySlow,
    when: [
      { state: toggledState, style: styles.activeButton },
      { state: notToggledState, style: styles.inactiveButton },
    ],
  });

  return (
    <Fluid.View
      label="button"
      onPress={onToggle}
      states={[toggledState, notToggledState]}
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
