import * as React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Section } from "./Model";
import Svg, { LinearGradient, Stop, Rect } from "react-native-svg";

type HeaderProps = {
  section: Section;
};

const { width } = Dimensions.get("window");

export default class Header extends React.PureComponent<HeaderProps> {
  render() {
    const { section } = this.props;
    const colors = [section.leftColor, section.rightColor];
    return (
      <View style={styles.container}>
        <Image source={section.image} style={styles.image} />
        <Svg style={styles.gradient} viewBox={"0 0 10 5"}>
          <LinearGradient id="grad" x1={0} y1={0} x2={10} y2={0}>
            <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
          </LinearGradient>
          <Rect x={0} y={0} width={10} height={5} fill={"url(#grad)"} />
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
});
