import React from "react";
import { StyleSheet, View, TextStyle } from "react-native";
import Fluid, { createFluidComponent } from "react-native-fluid-transitions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";

const FluidIcon = createFluidComponent<IconProps, TextStyle>(Icon, false);

type CallButtonProps = {
  isCalling: number;
};

const iconConfig = Fluid.createConfig({
  onEnter: {
    animation: { type: "timing", duration: 200 },
    state: "isCalling",
    loop: 2,
    interpolation: {
      outputRange: ["0deg", "-20deg", "0deg", "20deg", "0deg"],
      styleKey: "transform.rotate"
    }
  }
});

const CallButton: React.FC<CallButtonProps> = ({ isCalling }) => {
  const state = { name: "isCalling", active: true, value: isCalling };
  const config = Fluid.createConfig({
    childAnimation: {
      type: "staggered",
      staggerMs: 200
    }
  });
  return (
    <Fluid.View
      style={styles.container}
      states={state}
      config={config}
      onAnimationDone={() => console.log("animationdone")}
    >
      <Circle isStatic />
      <Circle />
      <Circle />
      <Circle />
      <FluidIcon config={iconConfig} name="phone" size={24} />
    </Fluid.View>
  );
};

type CallingIndicatorProps = {
  isStatic?: boolean;
};

const circleConfig = Fluid.createConfig({
  onEnter: {
    animation: { type: "timing", duration: 500 },
    state: "isCalling",
    interpolation: [
      {
        outputRange: [1, 2.5],
        styleKey: "transform.scale"
      },
      {
        styleKey: "opacity",
        outputRange: [1, 0]
      }
    ]
  }
});

const Circle: React.FC<CallingIndicatorProps> = ({ isStatic = false }) => {
  const size = boxSize * 0.5;
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.5,
    transform: isStatic ? [] : [{ scale: 0.0009 }]
  };

  return (
    <View style={styles.indicatorContainer}>
      <Fluid.View
        style={[styles.indicator, circleStyle]}
        config={isStatic ? undefined : circleConfig}
      />
    </View>
  );
};

const boxSize = 100;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: boxSize,
    width: boxSize
  },
  indicatorContainer: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
    width: boxSize,
    height: boxSize
  },
  indicator: {
    backgroundColor: "gold"
  }
});

export { CallButton };
