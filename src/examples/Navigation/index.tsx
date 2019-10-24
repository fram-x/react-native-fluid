import React, {
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { View, StyleSheet, Text, Button, Dimensions } from "react-native";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import { StateContext, ConfigStateType } from "react-native-fluid-transitions";
import Animated, { Easing } from "react-native-reanimated";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import { useNavigation } from "@react-navigation/core";
import { NavigationState } from "react-native-fluid-navigation";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    transform: [{ scale: 1 }],
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
StackCardInterpolationProps): StackCardInterpolatedStyle {
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
        headerShown: false,
        cardTransparent: true,
        cardOverlayEnabled: false,
        cardStyleInterpolator: customInterpolation,
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 2000,
              easing: Easing.linear,
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: 2000,
              easing: Easing.linear,
            },
          },
        },
      }}>
      <Stack.Screen
        name="screen1"
        component={() => (
          <FluidNavigationContainer name="screen1">
            <Screen name="Screen 1" color="gold" next="screen2" />
          </FluidNavigationContainer>
        )}
      />
      <Stack.Screen
        name="screen2"
        component={() => (
          <FluidNavigationContainer name="screen2">
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
          <FluidNavigationContainer name="screen3">
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
  const stateContext = useContext(StateContext);
  if (!stateContext) throw Error("States not found");

  const forwardTo = getState(NavigationState.ForwardTo, stateContext.states);
  const forwardFrom = getState(
    NavigationState.ForwardFrom,
    stateContext.states,
  );
  const backTo = getState(NavigationState.BackTo, stateContext.states);
  const backFrom = getState(NavigationState.BackFrom, stateContext.states);
  // const index = getState(NavigationState.Index, stateContext.states);
  // const none = getState(NavigationState.None, stateContext.states);

  const config = useFluidConfig({
    when: [
      {
        state: forwardTo,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.5, 1],
            outputRange: [0, 0, 1, 1],
          },
        ],
      },
      {
        state: forwardFrom,
        interpolation: {
          styleKey: "opacity",
          inputRange: [0, 0.45, 0.5, 1],
          outputRange: [1, 1, 0, 0],
        },
      },
      {
        state: backFrom,
        interpolation: {
          styleKey: "opacity",
          inputRange: [0, 0.45, 0.5, 1],
          outputRange: [1, 1, 0, 0],
        },
      },
      {
        state: backTo,
        interpolation: {
          styleKey: "opacity",
          inputRange: [0, 0.45, 0.5, 1],
          outputRange: [0, 0, 1, 1],
        },
      },
    ],
  });

  return (
    <Fluid.View
      label={name}
      style={[styles.container, { backgroundColor: color }]}
      config={config}
      states={[backFrom, backTo, forwardFrom, forwardTo]}>
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

const getState = (name: string, states: ConfigStateType[]): ConfigStateType => {
  const state = states.find(s => s.name === name);
  if (!state) throw Error("State " + name + " not found.");
  return state;
};

export default NavigationExampleScreen;
