import React, { useState, useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import Fluid from "react-native-fluid-transitions";

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  active: {
    transform: [{ rotate: "90deg" }],
  },
  inactive: {
    transform: [{ rotate: "0deg" }],
  },
};
const App = () => {
  const [active, setActive] = useState(false);
  const toggle = useCallback(() => setActive(a => !a), [active]);
  return (
    <Fluid.View staticStyle={styles.container} onPress={toggle}>
      <Fluid.View style={active ? styles.active : styles.inactive}>
        <Text>Hello World</Text>
      </Fluid.View>
    </Fluid.View>
  );
};

export default App;
