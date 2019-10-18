import React, { useContext } from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { View, StyleSheet, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { StateContext } from "react-native-fluid-transitions";
import Animated, { Easing } from "react-native-reanimated";
import {
  CardInterpolationProps,
  CardInterpolatedStyle,
} from "@react-navigation/stack/lib/typescript/stack/src/types";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import { ConfigStateType } from "src/packages/transitions/src/Configuration";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

function customInterpolation({
  current,
}: //next,
//layouts: { screen },
CardInterpolationProps): CardInterpolatedStyle {
  // const translateFocused = Animated.interpolate(current.progress, {
  //   inputRange: [0, 1],
  //   outputRange: [screen.width, 0],
  // });
  // const translateUnfocused = next
  //   ? Animated.interpolate(next.progress, {
  //       inputRange: [0, 1],
  //       outputRange: [0, Animated.multiply(screen.width, -0.3)],
  //     })
  //   : 0;

  const overlayOpacity = Animated.interpolate(current.progress, {
    inputRange: [0, 1],
    outputRange: [0, 0.07],
  });

  const shadowOpacity = Animated.interpolate(current.progress, {
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return {
    cardStyle: {
      // transform: [
      //   // Translation for the animation of the current card
      //   { translateX: translateFocused },
      //   // Translation for the animation of the card on top of this
      //   { translateX: translateUnfocused },
      // ],
    },
    overlayStyle: { opacity: overlayOpacity },
    shadowStyle: { shadowOpacity },
  };
}

const Stack = createStackNavigator();
const NavigationExampleScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: null,
        cardTransparent: true,
        cardOverlayEnabled: false,
        cardStyleInterpolator: customInterpolation,
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 4000,
              easing: Easing.linear,
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: 4000,
              easing: Easing.linear,
            },
          },
        },
      }}>
      <Stack.Screen
        name="screen1"
        component={() => (
          <FluidNavigationContainer>
            <Screen name="Screen 1" color="gold" next="screen2" />
          </FluidNavigationContainer>
        )}
      />
      <Stack.Screen
        name="screen2"
        component={() => (
          <FluidNavigationContainer>
            <Screen
              name="Screen 2"
              color="pink"
              prev="screen1"
              next="screen3"
            />
          </FluidNavigationContainer>
        )}
      />
      <Stack.Screen
        name="screen3"
        component={() => (
          <FluidNavigationContainer>
            <Screen name="Screen 3" color="aqua" prev="screen2" />
          </FluidNavigationContainer>
        )}
      />
    </Stack.Navigator>
  );
};

type Props = {
  name: string;
  color: string;
  next?: string;
  prev?: string;
};
const Screen: React.FC<Props> = ({ name, color, next, prev }) => {
  const navigation = useNavigation();
  const states = useContext(StateContext);
  const isNavigating =
    states && states.states.find(s => s.name === "isNavigating");
  // console.log(name, "navigating:", isNavigating);
  // const isSwiping =
  //   states &&
  //   states.states.find(s => s.name === "swiping" && s.active) !== undefined;
  // console.log(name, "swiping:", isSwiping);
  const isFocusedState =
    states && states.states.find(s => s.name === "isFocused");

  if (!isFocusedState || !isNavigating) throw new Error("Missing state");

  console.log(
    name,
    "focus:",
    isFocusedState.active,
    "nav:",
    isNavigating.active,
  );

  const config = useFluidConfig({
    when: [
      {
        state: isFocusedState as ConfigStateType,
        interpolation: [
          {
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [0, 0, 1, 1],
            styleKey: "opacity",
            value: {
              ownerLabel: "navigation",
              valueName: "current",
            },
          },
          {
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: ["45deg", "45deg", "45deg", "0deg"],
            styleKey: "transform.rotate",
            value: {
              ownerLabel: "navigation",
              valueName: "current",
            },
          },
        ],
      },
      {
        state: (isFocusedState as ConfigStateType).negated as ConfigStateType,
        interpolation: [
          {
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 1, 0, 0],
            styleKey: "opacity",
            value: {
              ownerLabel: "navigation",
              valueName: "current",
            },
          },
          {
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 0.8, 0.8, 0.8],
            styleKey: "transform.scale",
            value: {
              ownerLabel: "navigation",
              valueName: "current",
            },
          },
        ],
      },
    ],
  });
  return (
    <Fluid.View
      label={name}
      style={[styles.container, { backgroundColor: color }]}
      config={config}
      states={isFocusedState}>
      <Text>{"Hello world from " + name + "!"}</Text>
      <View style={styles.buttons}>
        {prev && (
          <Button title={"Back"} onPress={() => navigation.navigate(prev)} />
        )}
        {next && (
          <Button title={"Next"} onPress={() => navigation.navigate(next)} />
        )}
      </View>
    </Fluid.View>
  );
};

export default NavigationExampleScreen;
