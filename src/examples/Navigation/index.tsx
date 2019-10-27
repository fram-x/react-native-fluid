import React from "react";
import { FluidNavigationContainer } from "react-native-fluid-navigation";
import { createFluidStackNavigator } from "react-native-fluid-navigation";

import { Screen } from "./screen";

const Stack = createFluidStackNavigator();
const NavigationExampleScreen = () => {
  return (
    <Stack.Navigator>
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
              showBubbles={false}
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
            <Screen
              name="Screen 4"
              color="beige"
              prev="screen3"
              showBubbles={false}
            />
          </FluidNavigationContainer>
        )}
      />
    </Stack.Navigator>
  );
};

export default NavigationExampleScreen;
