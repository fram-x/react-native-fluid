import { StyleProp, LayoutChangeEvent } from "react-native";
import { OnAnimationFunction } from "../Components/Types";
import {
  ConfigStateType,
  ConfigAnimationType,
  ConfigType,
} from "../Configuration";

export interface ComponentProps<PT> {
  label?: string;
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
