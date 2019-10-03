import React from "react";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import { GestureContainer } from "react-native-fluid-gestures";
import { StyleSheet, View } from "react-native";
import * as Colors from "../colors";

const valueDragX = {
  ownerLabel: "gestureContainer",
  valueName: "translateX",
};

const valueDragY = {
  ownerLabel: "gestureContainer",
  valueName: "translateY",
};

const DraggingExampleScreen = () => {
  const config = useFluidConfig({
    onEnter: {
      state: "dragging",
      interpolation: {
        inputRange: [0, 1],
        outputRange: [Colors.ColorA, Colors.ColorB],
        styleKey: "backgroundColor",
      },
    },
    onExit: {
      state: "dragging",
      interpolation: {
        inputRange: [0, 1],
        outputRange: [Colors.ColorB, Colors.ColorA],
        styleKey: "backgroundColor",
      },
    },
    when: [
      {
        state: "dragging",
        interpolation: {
          styleKey: "transform.translateX",
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "extend",
          value: valueDragX,
        },
      },
      {
        state: "dragging",
        interpolation: {
          styleKey: "transform.translateY",
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "extend",
          value: valueDragY,
        },
      },
    ],
  });
  return (
    <GestureContainer label="gestureContainer" style={styles.container}>
      <Fluid.View
        config={config}
        style={styles.staticBox}
        staticStyle={styles.box}
      />
    </GestureContainer>
  );
};

DraggingExampleScreen.navigationOptions = {
  title: "Dragging",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
  },
  staticBox: {
    backgroundColor: Colors.ColorA,
  },
});

export default DraggingExampleScreen;
