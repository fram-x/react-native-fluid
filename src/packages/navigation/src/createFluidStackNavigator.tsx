import React from "react";
import {
  createStackNavigator,
  NavigationStackOptions,
  NavigationStackProp,
  NavigationStackConfig,
} from "react-navigation-stack";
import Animated, { Easing } from "react-native-reanimated";
import { NavigationTiming } from "./types";
import {
  NavigationRouteConfigMap,
  CreateNavigatorConfig,
  NavigationStackRouterConfig,
} from "react-navigation";
import {
  CardInterpolationProps,
  CardInterpolatedStyle,
} from "react-navigation-stack/lib/typescript/src/types";

export const createFluidStackNavigator = (
  routeConfigMap: NavigationRouteConfigMap<
    NavigationStackOptions,
    NavigationStackProp
  >,
  stackConfig?: CreateNavigatorConfig<
    NavigationStackConfig,
    NavigationStackRouterConfig,
    NavigationStackOptions,
    NavigationStackProp
  >,
): React.ComponentType<{}> => {
  return createStackNavigator(routeConfigMap, {
    ...stackConfig,
    headerMode: "none",
    defaultNavigationOptions: {
      cardShadowEnabled: false,
      cardOverlayEnabled: false,
      cardTransparent: true,
      cardStyle: { backgroundColor: "#FFF" },
      onTransitionStart: () => {},
      onTransitionEnd: () => {},
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
    },
  });
};

function customInterpolation({
  current,
  next,
}: CardInterpolationProps): CardInterpolatedStyle {
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
