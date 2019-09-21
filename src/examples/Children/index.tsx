import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Colors from "../colors";

import Fluid from "react-native-fluid-transitions";

const config = Fluid.createConfig({
  animation: Fluid.Animations.Springs.Gentle,
  when: {
    state: "active",
    style: {
      opacity: 0,
      transform: [{ scale: 0.009 }, { translateY: -64 }],
    },
  },
  onEnter: {
    state: Fluid.States.StateMounted,
    interpolation: {
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1],
      styleKey: "transform.scaleY",
    },
  },
});

const Bubble: React.FunctionComponent<{
  label: string;
  color: string;
  active: boolean;
}> = ({ label, color, active }) => {
  const activeState = { name: "active", active };
  return (
    <Fluid.View
      label={"inner-" + label}
      initialStyle={{
        opacity: 0,
        transform: [{ scale: 0.009 }, { translateY: -64 }],
      }}
      states={activeState}
      config={config}
      staticStyle={[styles.circle, { backgroundColor: color }]}
      style={{ opacity: 1 }}
    />
  );
};

const Frame: React.FunctionComponent<{
  label: string;
  active: boolean;
  color: string;
  childAnimation: "staggered" | "parallel" | "sequential";
}> = ({ label, childAnimation, active, color }) => {
  const config = Fluid.createConfig({
    childAnimation: {
      type: childAnimation,
    },
  });

  return (
    <Fluid.View
      label={"container-" + label}
      config={config}
      style={{
        borderColor: "#CCC",
        borderWidth: 0.5,
        borderRadius: 4,
        padding: 20,
        paddingHorizontal: 40,
        flexDirection: "row",
        marginBottom: 14,
      }}>
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
        style={{
          borderColor: "#CCC",
          borderWidth: 0.5,
          padding: 14,
          margin: 14,
          borderRadius: 4,
          overflow: "hidden",
        }}>
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
  text: {
    fontSize: 11,
    margin: 6,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 10,
  },
});

export default TextExampleScreen;
