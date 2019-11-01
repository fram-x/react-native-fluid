import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Colors from "../colors";

import Fluid, { ChildAnimation } from "react-native-fluid-transitions";
import { Bubble } from "./bubble";

const Frame: React.FunctionComponent<{
  label: string;
  active: boolean;
  color: string;
  childAnimation: any;
}> = ({ label, childAnimation, active, color }) => {
  const config = ChildAnimation({
    type: childAnimation,
  });

  return (
    <Fluid.View
      label={"container-" + label}
      config={config}
      staticStyle={styles.bubbleContainer}>
      <Bubble active={active} label={label + "-inner-1"} color={color} />
      <Bubble active={active} label={label + "-inner-2"} color={color} />
      <Bubble active={active} label={label + "-inner-3"} color={color} />
    </Fluid.View>
  );
};

const TextExampleScreen = () => {
  const [active, setIsActive] = useState(false);
  const toggelActive = () => {
    setIsActive(!active);
  };
  const direction = active ? "backward" : "forward";
  const config = Fluid.createConfig({
    childAnimation: { type: "sequential", direction },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sequential</Text>
      <Fluid.View
        label="container"
        onPress={toggelActive}
        config={config}
        style={styles.bubble}>
        <Text style={styles.text}>Sequential</Text>
        <Frame
          label="B"
          active={active}
          childAnimation="sequential"
          color={Colors.ColorB}
        />
        <Text style={styles.text}>Parallel</Text>
        <Frame
          label="C"
          active={active}
          childAnimation="parallel"
          color={Colors.ColorC}
        />
        <Text style={styles.text}>Staggered</Text>
        <Frame
          label="A"
          active={active}
          childAnimation="staggered"
          color={Colors.ColorA}
        />
      </Fluid.View>
    </View>
  );
};

TextExampleScreen.navigationOptions = { title: "Text " };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  bubbleContainer: {
    borderColor: "#CCC",
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 20,
    paddingHorizontal: 40,
    flexDirection: "row",
    marginBottom: 14,
  },
  text: {
    fontSize: 11,
    margin: 6,
  },

  bubble: {
    borderColor: "#CCC",
    borderWidth: 0.5,
    padding: 14,
    margin: 14,
    borderRadius: 4,
    overflow: "hidden",
  },
});

export default TextExampleScreen;
