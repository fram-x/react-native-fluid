import Reactfrom "react";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "react-navigation-stack";
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
  return {
    cardStyle: {
      opacity: next
        ? Animated.interpolate(next.progress, {
            inputRange: [0, 0.4999, 0.5001, 1],
            outputRange: [1, 1, 0, 0],
          })
        : Animated.interpolate(current.progress, {
            inputRange: [0, 0.4999, 0.5001, 1],
            outputRange: [0, 0, 1, 1],
          }),
    },
  };
}
