import React, { Children } from "react";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import Animated, { Easing } from "react-native-reanimated";
import { NavigationTiming } from "./types";

export const createFluidStackNavigator = () => {
  const Stack = createStackNavigator();
  const Navigator: React.FC = ({ children }) => (
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
              duration: NavigationTiming,
              easing: Easing.linear,
            },
          },
          close: {
            animation: "timing",
            config: {
              duration: NavigationTiming,
              easing: Easing.linear,
            },
          },
        },
      }}>
      {children}
    </Stack.Navigator>
  );
  return {
    Navigator,
    Screen: Stack.Screen,
  };
};

function customInterpolation({
  index,
  current,
  next,
}: //layouts: { screen },
StackCardInterpolationProps): StackCardInterpolatedStyle {
  // console.log(
  //   "SPEC NODES",
  //   index,
  //   current.progress.__nodeID,
  //   next ? next.progress.__nodeID : "undefined",
  // );
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
