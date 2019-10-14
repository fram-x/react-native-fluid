import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import MovingButton from "./MovingButton";
import { ProgressBar, ProgressItem } from "./ProgressBar";
import { Pager } from "./Pager";
import Fluid from "react-native-fluid-transitions";

const StyleExampleScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Fluid.View style={styles.container} label="container">
      <Text style={styles.text}>Double-tap to tween</Text>
      <MovingButton />

      <Text style={styles.text}>Tap to update your inbox</Text>

      <ProgressBar activeIndex={activeIndex}>
        <ProgressItem
          selected={activeIndex === 0}
          active={activeIndex >= 0}
          label={"1"}
        />
        <ProgressItem
          selected={activeIndex === 1}
          active={activeIndex >= 1}
          label={"2"}
        />
        <ProgressItem
          selected={activeIndex === 2}
          active={activeIndex >= 2}
          label={"3"}
        />
        <ProgressItem
          selected={activeIndex === 3}
          active={activeIndex >= 3}
          label={"4"}
        />
      </ProgressBar>
      <Pager activeIndex={activeIndex} count={4} />
      <Text style={styles.text}>Move through the stages</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => setActiveIndex(Math.max(0, activeIndex - 1))}>
          <Text>&lt;-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => setActiveIndex(Math.min(3, activeIndex + 1))}>
          <Text>-></Text>
        </TouchableOpacity>
      </View>
    </Fluid.View>
  );
};

StyleExampleScreen.navigationOptions = {
  title: "Styles",
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#CCC",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 11,
    marginBottom: 15,
  },
});

export default StyleExampleScreen;
