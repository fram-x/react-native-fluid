import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Fluid from "react-native-fluid-transitions";
import { ColorC, ColorE } from "../colors";
import { useHorizontalTransition } from "react-native-fluid-navigation";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  active: {
    backgroundColor: ColorE,
    width: 200,
    height: 50,
    borderRadius: 25,
  },
  inactive: {
    backgroundColor: ColorC,
    width: 300,
    height: 50,
    borderRadius: 0,
  },
});

const AnimatedButton: React.FC = ({ children }) => {
  const [active, setActive] = useState(true);
  const toggle = () => setActive(p => !p);
  const horizontalTransition = useHorizontalTransition(
    Dimensions.get("window").width,
  );
  return (
    <Fluid.View
      config={horizontalTransition}
      onPress={toggle}
      staticStyle={styles.container}
      style={active ? styles.active : styles.inactive}>
      {children}
    </Fluid.View>
  );
};

export { AnimatedButton };
