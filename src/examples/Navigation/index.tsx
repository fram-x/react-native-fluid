import React from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { createFluidStackNavigator } from "react-native-fluid-navigation";

import { Screen } from "./screen";
import { ColorA, ColorB, ColorC, ColorE } from "../colors";

const NavigationExampleScreen = createFluidStackNavigator({
  screen1: () => (
    <FluidNavigationContainer name="screen1">
      <Screen
        name="Screen 1"
        color="gold"
        next="screen2"
        interpolatorPosition={"flex-start"}
        interpolationColor={ColorE}
      />
    </FluidNavigationContainer>
  ),

  screen2: () => (
    <FluidNavigationContainer name="screen2">
      <Screen
        mode={"list"}
        name="Screen 2"
        interpolationColor={ColorA}
        interpolatorPosition={"flex-end"}
        color="pink"
        prev="screen1"
        next="screen3"
      />
    </FluidNavigationContainer>
  ),

  screen3: () => (
    <FluidNavigationContainer name="screen3">
      <Screen
        name="Screen 3"
        color="aqua"
        prev="screen2"
        next="screen4"
        interpolatorPosition={"flex-start"}
        interpolationColor={ColorB}
      />
    </FluidNavigationContainer>
  ),

  screen4: () => (
    <FluidNavigationContainer name="screen4">
      <Screen
        interpolationColor={ColorC}
        name="Screen 4"
        color="beige"
        prev="screen3"
        interpolatorPosition={"flex-end"}
        mode="boxes"
      />
    </FluidNavigationContainer>
  ),
});

export default NavigationExampleScreen;
