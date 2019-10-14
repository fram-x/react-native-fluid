import React from "react";
import Fluid, {
  useFluidConfig,
  useFluidState,
} from "react-native-fluid-transitions";
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
  const [isSnappingState, setIsSnapping] = useFluidState(false);
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
        onEnd: () => setIsSnapping(false),
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
          staticStyle={styles.box}
        />
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
  },
  staticBox: {
    backgroundColor: Colors.ColorA,
  },
});

export default DraggingExampleScreen;
