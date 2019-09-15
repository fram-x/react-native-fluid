import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Fluid from "react-native-fluid-svg";
import { ColorA, ColorC } from "../colors";
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg";

const SvgExampleScreen = () => {
  const [isToggled, setIsToggled] = useState(false);
  const toggle = () => setIsToggled(p => !p);
  const { width, height } = Dimensions.get("window");
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <Fluid.Svg.LinearGradient
            id="grad"
            x1={isToggled ? "0" : "50"}
            y1="0"
            x2="200"
            y2="0"
          >
            <Stop offset="0" stopColor="yellow" stopOpacity="1" />
            <Stop offset="1" stopColor="red" stopOpacity="1" />
          </Fluid.Svg.LinearGradient>
        </Defs>
        <Fluid.Svg.Ellipse
          fill={"url(#grad)"}
          stroke={ColorC}
          strokeWidth={5}
          cx={width / 2}
          cy={height / 2}
          rx={50}
          ry={isToggled ? 100 : 50}
          onPress={toggle}
        />
      </Svg>
    </View>
  );
};

SvgExampleScreen.navigationOptions = {
  title: "SVG"
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    flex: 1
  }
});

export default SvgExampleScreen;
