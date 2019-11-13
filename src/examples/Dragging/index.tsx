import React from "react";
import Fluid, {
  useFluidState,
  OnEnterState,
  OnExitState,
  WhenState,
  InterpolationValue,
} from "react-native-fluid-transitions";
import { GestureContainer } from "react-native-fluid-gestures";
import { StyleSheet, View } from "react-native";
import * as Colors from "../colors";
import { Label, useFluidConfig } from "react-native-fluid-transitions";

const DraggingExampleScreen = () => {
  const [isSnappingState, setIsSnapping] = useFluidState(false);

  const gestureLabel = Label("gestureContainer");
  const valueDragX = InterpolationValue(
    gestureLabel,
    GestureContainer.TranslateX,
  );
  const valueDragY = InterpolationValue(
    gestureLabel,
    GestureContainer.TranslateY,
  );

  const config = useFluidConfig(
    OnEnterState(
      "dragging",
      {
        inputRange: [0, 1],
        outputRange: [Colors.ColorA, Colors.ColorB],
        styleKey: "backgroundColor",
      },
      { onBegin: () => setIsSnapping(false) },
    ),
    OnExitState(
      "dragging",
      {
        inputRange: [0, 1],
        outputRange: [Colors.ColorB, Colors.ColorA],
        styleKey: "backgroundColor",
      },
      { onBegin: () => setIsSnapping(true) },
    ),
    WhenState("dragging", {
      styleKey: "transform.translateX",
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "extend",
      value: valueDragX,
    }),
    WhenState("dragging", {
      styleKey: "transform.translateY",
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "extend",
      value: valueDragY,
    }),
    WhenState(
      isSnappingState,
      {
        opacity: 1,
        transform: [{ translateX: 0 }, { translateY: 0 }],
      },
      {
        animation: Fluid.Animations.Springs.Gentle,
        onEnd: () => setIsSnapping(false),
      },
    ),
  );

  return (
    <View style={styles.container}>
      <GestureContainer label={gestureLabel} style={styles.box}>
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
