import React from "react";

import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import HomeScreen from "./HomeScreen";
import StylesExampleScreen from "./Styles";
import TextExampleScreen from "./Text";
import AppStoreExampleScreen from "./AppStore";
import ListExampleScreen from "./Lists";
import MazeExampleScreen from "./Maze";
import ParallaxExampleScreen from "./Parallax";
import ChildExampleScreen from "./Children";
import InterpolateExampleScreen from "./Interpolate";
import StaggerExampleScreen from "./Stagger";
import EasingsExampleScreen from "./Easings";
import StyleExampleScreen from "./Style";
import InteractionsExampleScreen from "./Interactions";
import SvgExampleScreen from "./SVG";
import RepeatExampleScreen from "./Repeating";
import DraggingExampleScreen from "./Dragging";
import NavigationExampleScreen from "./Navigation";
import DriverExampleScreen from "./Driver";
import FlutterExampleScreen from "./Flutter";

import Fluid from "react-native-fluid-transitions";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator({
  home: HomeScreen,
  styles: StylesExampleScreen,
  text: TextExampleScreen,
  interpolate: InterpolateExampleScreen,
  maze: MazeExampleScreen,
  parallax: ParallaxExampleScreen,
  stagger: StaggerExampleScreen,
  easings: EasingsExampleScreen,
  style: StyleExampleScreen,
  svg: SvgExampleScreen,
  repeat: RepeatExampleScreen,
  dragging: DraggingExampleScreen,
  navigation: NavigationExampleScreen,
  interactions: InteractionsExampleScreen,
  driver: DriverExampleScreen,
  children: ChildExampleScreen,
  appStore: AppStoreExampleScreen,
  list: ListExampleScreen,
  flutter: FlutterExampleScreen,
});

const AppNavigator = createAppContainer(Stack);

export default () => {
  return (
    <Fluid.View staticStyle={StyleSheet.absoluteFill} label={"container"}>
      <AppNavigator />
    </Fluid.View>
  );
};
