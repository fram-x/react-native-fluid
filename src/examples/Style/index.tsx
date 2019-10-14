import React, { useState, useCallback } from "react";
import Fluid from "react-native-fluid-transitions";
import { StyleSheet, View, Text } from "react-native";
import * as Colors from "../colors";

const boxStyles = [
  {
    width: 100,
    height: 100,
    backgroundColor: Colors.ColorA,
    borderRadius: 50,
  },
  {
    width: 200,
    height: 100,
    backgroundColor: Colors.ColorB,
    borderRadius: 50,
  },
  {
    width: 200,
    height: 200,
    backgroundColor: Colors.ColorC,
    borderRadius: 50,
  },
  {
    width: 100,
    height: 200,
    backgroundColor: Colors.ColorD,
    borderRadius: 50,
  },
  {
    width: 100,
    height: 200,
    backgroundColor: Colors.ColorE,
    borderRadius: 50,
    transform: [{ rotate: "180deg" }],
  },
];

const StyleExampleScreen = () => {
  const [currentStyle, setCurrentStyle] = useState(0);
  const toggleStyle = useCallback(() => {
    setCurrentStyle(c => (c + 1 === boxStyles.length ? 0 : c + 1));
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Fluid.View style={boxStyles[currentStyle]} onPress={toggleStyle} />
      </View>
      <View style={styles.separator} />
      <View style={styles.content}>
        <Text style={styles.text}>Tap to toggle between styles</Text>
        <Text style={styles.styleText}>
          {`<Fluid.View style={${JSON.stringify(
            boxStyles[currentStyle],
            null,
            2,
          )} />`}
        </Text>
      </View>
    </View>
  );
};

StyleExampleScreen.navigationOptions = {
  title: "Style",
};

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
  },
});

export default StyleExampleScreen;
