import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Fluid from "react-native-fluid-transitions";

type Props = {
  text: string;
  onPress?: () => void;
};
const InteractionContainer: React.FC<Props> = ({ text, onPress, children }) => {
  return (
    <Fluid.View style={styles.container} onPress={onPress}>
      <View style={styles.controlContainer}>{children}</View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Fluid.View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 30,
    height: width / 2 - 30,
    borderColor: "#444",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    margin: 10,
    overflow: "hidden"
  },
  controlContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    flex: 1
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4
  },
  text: {
    textAlign: "center",
    fontSize: 11
  }
});

export { InteractionContainer };
