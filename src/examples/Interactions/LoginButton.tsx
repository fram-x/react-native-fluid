import React, { useState } from "react";
import { StyleSheet, TextStyle, Text, Dimensions } from "react-native";
import Fluid, {
  createFluidComponent,
  Easings,
} from "react-native-fluid-transitions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconProps } from "react-native-vector-icons/Icon";

import { ColorA } from "../colors";
import { useFluidState } from "react-native-fluid-transitions";

const FluidIcon = createFluidComponent<IconProps, TextStyle>(Icon, false);
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    width: width / 3,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorA,
  },
  loggedOut: {
    width: width / 3,
  },
  loggingIn: {
    width: 44,
  },
  text: {
    fontSize: 12,
    color: "#FFF",
  },
});

const LoginButton = () => {
  const [isLoggingIn, setIsLoggingIn] = useFluidState(false);
  const iconConfig = Fluid.createConfig({
    when: {
      state: isLoggingIn,
      animation: { type: "timing", duration: 800, easing: Easings.linear },
      loop: Infinity,
      interpolation: {
        outputRange: ["0deg", "360deg"],
        styleKey: "transform.rotate",
      },
    },
  });
  const toggle = () => setIsLoggingIn(p => !p);

  return (
    <Fluid.View
      staticStyle={styles.container}
      style={isLoggingIn.active ? styles.loggingIn : styles.loggedOut}
      onPress={toggle}>
      {!isLoggingIn.active && <Text style={styles.text}>Login</Text>}
      {isLoggingIn.active && (
        <FluidIcon
          config={iconConfig}
          initialStyle={{ transform: [{ scale: 0.0009 }] }}
          states={isLoggingIn}
          name="loading"
          size={22}
          color={"#FFF"}
        />
      )}
    </Fluid.View>
  );
};

export { LoginButton };
