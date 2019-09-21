import React from "react";
import { StyleSheet, Text } from "react-native";
import Fluid from "react-native-fluid-transitions";

type AnimatedNumberProps = {
  value: number;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const digits = value.toString().split("");
  return (
    <Fluid.View style={styles.container}>
      {digits.map((s, index) => (
        <Number key={index} value={parseInt(s, 10)} />
      ))}
    </Fluid.View>
  );
};

type NumberProps = {
  value: number;
};
const Number: React.FC<NumberProps> = ({ value }) => {
  const style = {
    transform: [{ translateY: -(value * boxHeight) }],
  };
  return (
    <Fluid.View
      style={[styles.numberContainer, style]}
      animation={Fluid.Animations.Springs.NoWobble}>
      {[...Array(10).keys()].map((_, index) => (
        <Text style={styles.digit} key={index}>
          {index}
        </Text>
      ))}
    </Fluid.View>
  );
};

const boxHeight = 24;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: boxHeight,
    overflow: "hidden",
  },
  numberContainer: {
    height: boxHeight,
  },
  digit: {
    height: boxHeight,
    fontFamily: "Arial",
    fontSize: 24,
  },
});

export { AnimatedNumber };
