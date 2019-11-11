import { StyleProp, LayoutChangeEvent } from "react-native";
import { OnAnimationFunction } from "../Components/Types";
import {
  ConfigStateType,
  ConfigAnimationType,
  ConfigType,
} from "../Configuration";

export type FluidLabel = {
  name: string;
};

export const Label = (name: string) => {
  return {
    name,
  };
};

export const getResolvedLabel = (label?: string | FluidLabel) => {
  return !label ? undefined : typeof label === "string" ? label : label.name;
};

export interface ComponentProps<PT> {
  label?: string | FluidLabel;
  initialStyle?: StyleProp<PT>;
  // We need to redeclare style/onLayout
  style?: StyleProp<PT>;
  staticStyle?: StyleProp<PT>;
  animation?: ConfigAnimationType;
  onLayout?: (event: LayoutChangeEvent) => void;
  states?: ConfigStateType | Array<ConfigStateType>;
  config?: ConfigType | ConfigType[];
  onAnimationDone?: OnAnimationFunction;
  onAnimationBegin?: OnAnimationFunction;
}

export interface TouchableComponentProps<PT> extends ComponentProps<PT> {
  onPress?: () => void;
  onPressOut?: () => void;
  onPressIn?: () => void;
}
