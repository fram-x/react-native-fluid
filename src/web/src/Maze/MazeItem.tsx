import React from "react";
import { View } from "react-native";
import { styles } from "./styles";
import Fluid from "react-native-fluid-transitions";

interface MazeItemProps {
  size: number;
  index: number;
  isSet: boolean;
}

export const MazeItem: React.FC<MazeItemProps> = ({ isSet, index, size }) => {
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Fluid.View
        label={index.toString()}
        // animation={{ type: "timing", duration: 6000, easing: Easings.linear }}
        staticStyle={[styles.line, { height: size * 1.5 }]}
        style={isSet ? styles.setBox : styles.offsetBox}
      />
    </View>
  );
};
