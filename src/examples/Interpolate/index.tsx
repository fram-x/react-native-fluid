import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import Fluid, { Easings } from "react-native-fluid-transitions";
import * as Colors from "../colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { generateImageUri } from "../helpers";

const imageUri = generateImageUri(21, 150, 150);

const InterpolateExampleScreen = () => {
  const [isInterpolatingImage, setIsInterpolatingImage] = useState(false);
  const toggleImageInterpolation = () =>
    setIsInterpolatingImage(!isInterpolatingImage);

  const imageState = {
    name: "isInterpolatingImage",
    active: isInterpolatingImage,
  };

  const [isInterpolatingBoxes, setIsInterpolatingBoxes] = useState(false);

  const toggleBoxesInterpolation = () =>
    setIsInterpolatingBoxes(!isInterpolatingBoxes);

  const boxState = {
    name: "isInterpolatingBoxes",
    active: isInterpolatingBoxes,
  };
  const states = [boxState, imageState];

  const config = Fluid.createConfig({});

  const ImageEnterInterpolation = Fluid.createConfig({
    onEnter: {
      state: "isInterpolatingImage",
      fromLabel: "imageA",
    },
  });
  const ImageExitInterpolation = Fluid.createConfig({
    onExit: {
      state: "isInterpolatingImage",
      fromLabel: "imageB",
    },
  });

  const BoxEnterInterpolation = Fluid.createConfig({
    onEnter: {
      state: "isInterpolatingBoxes",
      fromLabel: "boxA",
    },
  });
  const BoxExitInterpolation = Fluid.createConfig({
    onExit: {
      state: "isInterpolatingBoxes",
      fromLabel: "boxB",
    },
  });

  return (
    <Fluid.View
      label="container"
      style={styles.container}
      states={states}
      config={config}>
      <Fluid.View label={"interpolating-images"} style={styles.boxContainer}>
        <Fluid.Image
          label={"imageA"}
          animation={Fluid.Animations.Timings.timing(Easings.sin, 2000)}
          style={styles.imageA}
          config={ImageExitInterpolation}
          source={{ uri: imageUri }}
        />
        <Fluid.Image
          label={"imageB"}
          animation={Fluid.Animations.Timings.timing(Easings.sin, 2000)}
          style={styles.imageB}
          config={ImageEnterInterpolation}
          source={{ uri: imageUri }}
        />
      </Fluid.View>
      {/* Swapper */}
      <Fluid.View label="arrow" onPress={toggleImageInterpolation}>
        <Icon name="arrow-right" size={28} color={"black"} />
      </Fluid.View>
      <Text style={styles.description}>
        Tap the arrow to interpolate the images
      </Text>
      {/* Boxes */}
      <Fluid.View label={"interpolating-boxes"} style={styles.boxContainer}>
        <Fluid.View
          label={"boxA"}
          animation={{ type: "timing", duration: 4000 }}
          style={styles.boxA}
          config={BoxExitInterpolation}>
          <Text>{"Box A"}</Text>
        </Fluid.View>
        <Fluid.View
          label={"boxB"}
          animation={{ type: "timing", duration: 4000 }}
          style={styles.boxB}
          config={BoxEnterInterpolation}>
          <Text>{"Box B"}</Text>
        </Fluid.View>
      </Fluid.View>
      {/* Swapper */}
      <Fluid.View
        label="arrow"
        onPress={toggleBoxesInterpolation}
        // config={
        //   <Fluid.Configuration>
        //     <Fluid.When
        //       state="isInterpolatingBoxes"
        //       style={styles.isInterpolating}
        //     />
        //   </Fluid.Configuration>
        // }
      >
        <Icon name="arrow-right" size={28} color={"black"} />
      </Fluid.View>
      <Text style={styles.description}>
        Tap the arrow to interpolate the boxes
      </Text>
    </Fluid.View>
  );
};

InterpolateExampleScreen.navigationOptions = {
  title: "Interpolate",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  boxContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 140,
  },
  boxA: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.ColorD,
    borderWidth: 4,
    transform: [{ rotate: "45deg" }],
  },
  boxB: {
    width: 75,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.ColorE,
    borderWidth: 4,
    borderRadius: 50,
  },
  imageA: {
    width: 100,
    height: 100,
    borderRadius: 50,
    transform: [{ rotate: "45deg" }],
  },
  imageB: {
    width: 100,
    height: 100,
  },
  isInterpolating: {},
  description: {
    textAlign: "center",
    padding: 20,
  },
  border: {
    alignSelf: "stretch",
    borderTopColor: "#333",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default InterpolateExampleScreen;
