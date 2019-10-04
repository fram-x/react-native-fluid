import React, { useEffect, useState } from "react";
import Fluid, {
  useFluidConfig,
  useFluidState,
} from "react-native-fluid-transitions";
import { GestureContainer } from "react-native-fluid-gestures";
import { StyleSheet, View, Text } from "react-native";
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
  const [isSnappingState, setIsSnappingInt] = useFluidState(false);
  const [s, setS] = useState("Tic");

  const setIsSnapping = (v: boolean) => {
    setIsSnappingInt(v);
    console.log("Snapping", v);
  };

  useEffect(() => {
    setTimeout(() => setS(p => (p === "Tic" ? "Toc" : "Tic")), 500);
  }, [s]);

  const config = useFluidConfig({
    onEnter: {
      state: "dragging",
      onBegin: () => setIsSnapping(false),
      interpolation: {
        inputRange: [0, 1],
        outputRange: [Colors.ColorA, Colors.ColorB],
        styleKey: "backgroundColor",
      },
    },
    onExit: [
      {
        state: "dragging",
        onBegin: () => setIsSnapping(true),
        interpolation: {
          inputRange: [0, 1],
          outputRange: [Colors.ColorB, Colors.ColorA],
          styleKey: "backgroundColor",
        },
      },
    ],
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
      {
        state: isSnappingState,
        onEnd: () => {
          setIsSnapping(false);
        },
        style: { transform: [{ translateX: 0 }, { translateY: 0 }] },
        animation: Fluid.Animations.Springs.WobblySlow,
      },
    ],
  });
  return (
    <View style={styles.container}>
      <GestureContainer label="gestureContainer" style={styles.box}>
        <Fluid.View
          config={config}
          states={isSnappingState}
          style={styles.staticBox}
          staticStyle={styles.box}>
          <Text style={styles.boxText}>{s}</Text>
        </Fluid.View>
      </GestureContainer>
    </View>
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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "bold",
  },
  staticBox: {
    backgroundColor: Colors.ColorA,
  },
});

export default DraggingExampleScreen;
