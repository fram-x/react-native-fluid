import React from "react";
import { NavigationNativeContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./HomeScreen";
import StylesExampleScreen from "./Styles";
import TextExampleScreen from "./Text";
import AppStoreExampleScreen from "./AppStore";
import ListExampleScreen from "./Lists";
import MazeExampleScreen from "./Maze";
import ParallaxExampleScreen from "./Parallax";
import ChildExampleScreen from "./Children";
import InterpolateExampleScreen from "./Interpolate";
import TimelineExampleScreen from "./Timeline";
import EasingsExampleScreen from "./Easings";
import StyleExampleScreen from "./Style";
import InteractionsExampleScreen from "./Interactions";
import SvgExampleScreen from "./SVG";
import RepeatExampleScreen from "./Repeating";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationNativeContainer>
      <Stack.Navigator
        screenOptions={{ cardStyle: { backgroundColor: "#FFF" } }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="styles" component={StylesExampleScreen} />
        <Stack.Screen name="text" component={TextExampleScreen} />
        <Stack.Screen name="appStore" component={AppStoreExampleScreen} />
        <Stack.Screen name="interpolate" component={InterpolateExampleScreen} />
        <Stack.Screen name="list" component={ListExampleScreen} />
        <Stack.Screen name="maze" component={MazeExampleScreen} />
        <Stack.Screen name="parallax" component={ParallaxExampleScreen} />
        <Stack.Screen name="children" component={ChildExampleScreen} />
        <Stack.Screen name="timeline" component={TimelineExampleScreen} />
        <Stack.Screen name="easings" component={EasingsExampleScreen} />
        <Stack.Screen name="style" component={StyleExampleScreen} />
        <Stack.Screen
          name="interactions"
          component={InteractionsExampleScreen}
        />
        <Stack.Screen name="svg" component={SvgExampleScreen} />
        <Stack.Screen name="repeat" component={RepeatExampleScreen} />
      </Stack.Navigator>
    </NavigationNativeContainer>
  );
};

export default App;
