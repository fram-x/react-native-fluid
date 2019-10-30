import React from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { createFluidStackNavigator } from "react-native-fluid-navigation";

import { Screen } from "./screen";

const NavigationExampleScreen = createFluidStackNavigator({
  screen1: () => (
    <FluidNavigationContainer name="screen1">
      <Screen name="Screen 1" color="gold" next="screen2" />
    </FluidNavigationContainer>
  ),

  screen2: () => (
    <FluidNavigationContainer name="screen2">
      <Screen
        showBubbles={false}
        name="Screen 2"
        color="pink"
        prev="screen1"
        next="screen3"
      />
    </FluidNavigationContainer>
  ),

  screen3: () => (
    <FluidNavigationContainer name="screen3">
      <Screen name="Screen 3" color="aqua" prev="screen2" next="screen4" />
    </FluidNavigationContainer>
  ),

  screen4: () => (
    <FluidNavigationContainer name="screen4">
      <Screen
        name="Screen 4"
        color="beige"
        prev="screen3"
        showBubbles={false}
      />
    </FluidNavigationContainer>
  ),
});

export default NavigationExampleScreen;
