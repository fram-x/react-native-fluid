import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import * as Colors from "../colors";
import { Repeater } from "./Repeater";
import Fluid from "react-native-fluid-transitions";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  separator: {
    height: 1,
    borderTopColor: "#444",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  text: {
    margin: 20,
  },
  styleText: {
    margin: 10,
    padding: 10,
    borderColor: "#666",
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: "Courier New",
    fontSize: 11,
  },
});

const RepeatExampleScreen = () => {
  const [isRepeating, setIsRepeating] = useState(false);
  const toggleRepeating = () => setIsRepeating(p => !p);
  return (
    <Fluid.View style={styles.container} onPress={toggleRepeating}>
      <View style={styles.content}>
        <Repeater
          isRepeating={isRepeating}
          loop={Infinity}
          flip={0}
          yoyo={0}
          color={Colors.ColorA}
        />
        <Text style={styles.text}>Loop</Text>
        <Repeater
          isRepeating={isRepeating}
          loop={0}
          flip={Infinity}
          yoyo={0}
          color={Colors.ColorB}
        />
        <Text style={styles.text}>Flip</Text>
        <Repeater
          isRepeating={isRepeating}
          loop={0}
          flip={0}
          yoyo={Infinity}
          color={Colors.ColorC}
        />
        <Text style={styles.text}>Yoyo</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.content}>
        <Text style={styles.styleText}>
          {`<Fluid.View 
  states={{ 
    name:"repeat", 
    active: true
  }}
  config={{
    animation: {
      type: "timing",
      duration: 1200,
      easing: Easings.back()
    },
    when: {
      state: "repeat",
      interpolation: {
        outputRange: [-50, 0, 50],
        styleKey: "transform.translateX"
      }
    }
  }} 
/>`}
        </Text>
      </View>
    </Fluid.View>
  );
};

RepeatExampleScreen.navigationOptions = { title: "Repeating" };

export default RepeatExampleScreen;
