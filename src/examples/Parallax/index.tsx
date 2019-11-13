import React from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import Fluid from "react-native-fluid-transitions";
import * as Colors from "../colors";
import { generateImageUri } from "../helpers";
import {
  InterpolationValue,
  useFluidConfig,
  Interpolation,
  Label,
} from "react-native-fluid-transitions";

const HeaderHeight = 52;

const ParallaxExampleScreen = () => {
  const size = Dimensions.get("window");
  const imageOffset = -80;

  // @ts-ignore
  const data = Array.apply(null, { length: 24 })
    .map(Function.call, Number)
    .map((s: string) => "Test " + s.toString());

  const { width: imageSize } = size;
  const uri = generateImageUri(20, imageSize, imageSize);

  const scrollerLabel = Label("scroller");
  const value = InterpolationValue(scrollerLabel, Fluid.ScrollView.ScrollY);

  const imageConfig = useFluidConfig(
    Interpolation(value, {
      styleKey: "transform.scale",
      inputRange: [-25, 0],
      outputRange: [1.1, 1],
      extrapolateRight: "clamp",
    }),
  );

  const headerContainerConfig = useFluidConfig(
    Interpolation(value, {
      styleKey: "backgroundColor",
      inputRange: [0, imageSize - HeaderHeight + imageOffset],
      outputRange: ["#FBB95800", Colors.ColorC],
      extrapolate: "clamp",
    }),
  );

  const headerTextConfig = useFluidConfig(
    Interpolation(value, {
      styleKey: "transform.scale",
      inputRange: [0, imageSize - HeaderHeight + imageOffset],
      outputRange: [1.5, 1],
      extrapolateRight: "clamp",
    }),
    Interpolation(value, {
      styleKey: "transform.translateX",
      inputRange: [0, imageSize - HeaderHeight + imageOffset],
      outputRange: [14, 1],
      extrapolateRight: "clamp",
    }),
    Interpolation(value, {
      styleKey: "color",
      inputRange: [0, imageSize - HeaderHeight + imageOffset],
      outputRange: [Colors.ColorC, "#FFF"],
      extrapolate: "clamp",
    }),
  );

  return (
    <Fluid.View staticStyle={styles.container} label="container">
      <Fluid.ScrollView label={scrollerLabel}>
        <Fluid.View
          label="image"
          staticStyle={styles.image}
          style={{
            width: imageSize,
            height: imageSize + imageOffset,
            transform: [{ translateY: imageOffset }],
          }}
          config={imageConfig}>
          <Image
            source={{ uri }}
            style={{
              width: imageSize,
              height: imageSize,
            }}
          />
        </Fluid.View>

        <Fluid.View staticStyle={styles.itemContainer} label="list">
          {data.map((d: string) => (
            <View key={d} style={styles.item}>
              <Text>{d}</Text>
            </View>
          ))}
        </Fluid.View>
      </Fluid.ScrollView>
      <Fluid.View
        staticStyle={styles.headerContainer}
        label={"header"}
        config={headerContainerConfig}>
        <Fluid.Text staticStyle={styles.headerText} config={headerTextConfig}>
          YOUR HOMEWORK
        </Fluid.Text>
      </Fluid.View>
    </Fluid.View>
  );
};

ParallaxExampleScreen.navigationOptions = {
  title: "Parallax",
  headerStyle: {
    backgroundColor: Colors.ColorC,
    shadowColor: "transparent",
    borderBottomWidth: 0,
  },
  headerTintColor: "#FFF",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-start",
    justifyContent: "center",
    height: HeaderHeight,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginLeft: 14,
  },
  itemContainer: {
    backgroundColor: "#EFEFEF",
  },
  item: {
    padding: 14,
    borderRadius: 8,
    borderColor: "#CCC",
    backgroundColor: "#FFF",
    borderWidth: StyleSheet.hairlineWidth,
    margin: 8,
    marginBottom: 0,
    height: 65,
    justifyContent: "center",
  },
  image: {
    backgroundColor: "#CCC",
  },
});

export default ParallaxExampleScreen;
