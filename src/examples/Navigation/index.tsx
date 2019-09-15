// @ts-ignore
import { Transitioner } from "react-navigation-stack";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import Screen3 from "./screen3";
import { createFluidNavigator } from "react-native-fluid-navigation";

export default createFluidNavigator({
  screen1: { screen: Screen1 },
  screen2: { screen: Screen2 },
  screen3: { screen: Screen3 }
});
