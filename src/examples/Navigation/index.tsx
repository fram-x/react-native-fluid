import React, { useContext } from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { View, StyleSheet, Text, Button } from "react-native";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import { StateContext } from "react-native-fluid-transitions";
import Animated, { Easing } from "react-native-reanimated";
import Fluid, { useFluidConfig } from "react-native-fluid-transitions";
import { useNavigation } from "@react-navigation/core";
import {
  ConfigStateType,
  OnFactoryFunction,
} from "src/packages/transitions/src/Configuration";
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

  // const isNavigating = getState("isNavigating", stateContext.states);
  // const isForward = getState("isForward", stateContext.states);
  const isActiveState = getState("isActive", stateContext.states);
  const navState = getState("navigationState", stateContext.states);

  console.log(name, "active:", isActiveState.active, navState.value);

  const config = useFluidConfig({
    when: [
      {
        state: navState,
        whenFactory: ({ screenSize, metrics, stateValue }) => {
          let translateX: Array<number> = [];
          let scale: Array<number> = [];
          switch (stateValue) {
            case NavigationState.None: {
              return { interpolation: [] };
            }
            case NavigationState.ForwardTo: {
              const value = screenSize.width;
              translateX = [value, 0];
              scale = [1, 1];
              break;
            }
            case NavigationState.ForwardFrom: {
              const value = -screenSize.width;
              translateX = [0, value];
              scale = [1, 0.8];
              break;
            }
            case NavigationState.BackTo: {
              const value = -screenSize.width;
              translateX = [value, 0];
              scale = [0.8, 1];
              break;
            }
            case NavigationState.BackFrom: {
              const value = screenSize.width;
              translateX = [0, value];
              scale = [1, 1];
              break;
            }
          }
          console.log(name, stateValue, translateX.join(", "));
          return {
            interpolation: [
              {
                styleKey: "transform.scale",
                inputRange: [0, 1],
                outputRange: scale,
                value: {
                  ownerLabel: "navigation",
                  valueName: "current",
                },
              },
              {
                styleKey: "transform.translateX",
                inputRange: [0, 1],
                outputRange: translateX,
                value: {
                  ownerLabel: "navigation",
                  valueName: "current",
                },
              },
            ],
          };
        },
      },
    ],
  });

  return (
    <Fluid.View
      label={name}
      style={[styles.container, { backgroundColor: color }]}
      config={config}
      states={[navState]}>
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
