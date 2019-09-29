import React, { useState } from "react";
import { Platform, TextInput, StyleSheet, View } from "react-native";
import Fluid from "react-native-fluid-transitions";
import { ColorA } from "../colors";

type Props = {
  placeholder?: string;
};
const FloatingLabel: React.FC<Props> = ({ placeholder }) => {
  const [value, setValue] = useState("");
  const onChangeText = (t: string) => setValue(t);
  return (
    <View style={styles.container}>
      {/* Placeholder */}
      <Fluid.Text style={value ? styles.placeholder : styles.placeholderEmpty}>
        {placeholder}
      </Fluid.Text>
      {/* Input */}
      <TextInput
        style={styles.input}
        underlineColorAndroid={"transparent"}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    justifyContent: "center",
    borderBottomColor: "#333",
    borderBottomWidth: StyleSheet.hairlineWidth,
    minWidth: 130,
  },
  placeholderEmpty: {
    ...StyleSheet.absoluteFillObject,
    marginVertical: 3,
    transform: [{ translateY: Platform.select({ default: 4, android: 8 }) }],
    color: "#555",
    fontSize: 14,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    marginVertical: 3,
    transform: [{ translateY: -10 }],
    color: ColorA,
    fontSize: 10,
  },
  input: {
    alignSelf: "stretch",
    padding: 0,
    margin: 0,
  },
});

export { FloatingLabel };
