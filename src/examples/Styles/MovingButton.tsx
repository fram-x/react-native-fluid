import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Fluid from "react-native-fluid-transitions";
import * as Colors from "../colors";

const MovingButton: React.FunctionComponent<{}> = () => {
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const pressedState = { name: "pressed", active: pressed };
  const toggledState = { name: "toggled", active };
  const notToggledState = { name: "nottoggled", active: !active };

  const onToggle = () => setActive(!active);
  const onPressIn = () => setPressed(true);
  const onPressOut = () => setPressed(false);

  const config = Fluid.createConfig({
    animation: Fluid.Animations.Springs.WobblySlow,
    when: [
      // { state: "pressed", style: styles.pressed },
      { state: "toggled", style: styles.activeButton },
      { state: "nottoggled", style: styles.inactiveButton }
    ]
  });

  return (
    <Fluid.View
      label="button"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onToggle}
      states={[pressedState, toggledState, notToggledState]}
      config={config}
      initialStyle={styles.initialStyle}
      staticStyle={styles.button}
    >
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
    backgroundColor: "white"
  },
  initialStyle: {
    transform: [{ scale: 0.009 }]
  },
  activeButton: {
    // transform: [{ translateX: 100 }]
    transform: [{ rotate: "-15deg" }, { translateX: 100 }]
  },
  inactiveButton: {
    // transform: [{ translateX: -100 }]
    transform: [{ rotate: "15deg" }, { translateX: -100 }]
  },
  pressed: {
    backgroundColor: "#CCC"
  }
});

export default MovingButton;
