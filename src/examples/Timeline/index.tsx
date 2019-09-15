import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as Colors from "../colors";
import Fluid from "react-native-fluid-transitions";

const config = Fluid.createConfig({
  interpolation: [
    {
      value: {
        ownerLabel: "scroller",
        valueName: "scrollY"
      },
      inputRange: [0, 800],
      outputRange: [Colors.ColorD, Colors.ColorA],
      styleKey: "backgroundColor",
      extrapolate: "clamp"
    },
    {
      value: {
        ownerLabel: "scroller",
        valueName: "scrollY"
      },
      inputRange: [0, 800],
      outputRange: ["0deg", "360deg"],
      styleKey: "transform.rotate"
    }
  ]
});

const TimelineExampleScreen = () => {
  return (
    <Fluid.ScrollView style={styles.container} label={"scroller"}>
      {new Array(50).fill(0.0, 0, 50).map((_, index) => (
        <Fluid.View key={index} config={config} style={styles.row}>
          <Text>{"row #" + index.toString()}</Text>
        </Fluid.View>
      ))}
    </Fluid.ScrollView>
  );
};

TimelineExampleScreen.navigationOptions = {
  title: "Testing 1-2-3"
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    padding: 10,
    margin: 10
  }
});

export default TimelineExampleScreen;
