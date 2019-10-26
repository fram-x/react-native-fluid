import React, { useContext, useRef, useEffect } from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
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
    paddingVertical: 50,
  },
  header: {
    padding: 14,
  },
  headerText: {
    fontSize: 48,
  },
  headerSubText: {
    color: "#4c4c4c",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 14,
  },
});

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
            <Screen
              name="Screen 3"
              color="aqua"
              prev="screen2"
              next="screen4"
            />
          </FluidNavigationContainer>
        )}
      />
      <Stack.Screen
        name="screen4"
        component={() => (
          <FluidNavigationContainer name="screen4">
            <Screen name="Screen 4" color="green" prev="screen3" />
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

const screenWidth = Dimensions.get("screen").width;

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
  const index = getState(NavigationState.Index, stateContext.states);
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
          {
            styleKey: "transform.scale",
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 0.8, 1],
          },
        ],
      },
      {
        state: forwardFrom,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 1, 0, 0],
          },
          {
            styleKey: "transform.scale",
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.8, 0.8],
          },
        ],
      },
      {
        state: backFrom,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [1, 1, 0, 0],
          },
          {
            styleKey: "transform.scale",
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.8, 0.8],
          },
        ],
      },
      {
        state: backTo,
        interpolation: [
          {
            styleKey: "opacity",
            inputRange: [0, 0.45, 0.55, 1],
            outputRange: [0, 0, 1, 1],
          },
          {
            styleKey: "transform.scale",
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 0.8, 1],
          },
        ],
      },
    ],
  });

  // Set opacity to 0 for all screens except the first one
  const styleRef = useRef<StyleProp<ViewStyle>>({
    ...styles.container,
    backgroundColor: color,
    opacity: index.value > 0 ? 0 : 1,
  });

  useEffect(() => {
    styleRef.current = {
      ...styles.container,
      backgroundColor: color,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fluid.View label={name} style={styleRef.current} config={config}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
        <Text style={styles.headerSubText}>
          {"Hello world from " + name + "!"}
        </Text>
      </View>
      <View style={styles.content} />
      <View style={styles.footer}>
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
