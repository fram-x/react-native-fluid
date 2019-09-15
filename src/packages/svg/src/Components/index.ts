import Fluid, {
  createFluidComponent,
  interpolateValue,
  ValueDescriptorType
} from "react-native-fluid-transitions";
import {
  Ellipse,
  EllipseProps,
  CircleProps,
  Circle,
  RectProps,
  Rect,
  Line,
  LineProps,
  LinearGradientProps,
  LinearGradient
} from "react-native-svg";
import { ViewStyle } from "react-native";
import { AnimationProvider } from "react-native-fluid-animations";

const defaultGetValue = (p: any) => p;
const defaultDescriptor: ValueDescriptorType = {
  defaultValue: 0,
  getDisplayValue: AnimationProvider.getDisplayValue,
  getNumericValue: defaultGetValue,
  defaultAnimation: Fluid.Animations.Springs.Default,
  extrapolate: "extend",
  interpolate: interpolateValue
};

// const defaultColorDescriptor: ValueDescriptorType = {
//   getNumericValue: AnimationProvider.getNumericColor,
//   getDisplayValue: AnimationProvider.getColorDisplayValue,
//   interpolate: interpolateColor,
//   defaultValue: 0,
//   extrapolate: "clamp",
//   defaultAnimation: Fluid.Animations.Timings.Micro
// };

export const FluidEllipse = createFluidComponent<EllipseProps, ViewStyle>(
  Ellipse,
  false,
  undefined,
  () => ({
    cx: defaultDescriptor,
    cy: defaultDescriptor,
    rx: defaultDescriptor,
    ry: defaultDescriptor
  })
);

export const FluidCircle = createFluidComponent<CircleProps, ViewStyle>(
  Circle,
  false,
  undefined,
  () => ({
    cx: defaultDescriptor,
    cy: defaultDescriptor,
    r: defaultDescriptor
  })
);

export const FluidRect = createFluidComponent<RectProps, ViewStyle>(
  Rect,
  false,
  undefined,
  () => ({
    x: defaultDescriptor,
    y: defaultDescriptor,
    width: defaultDescriptor,
    height: defaultDescriptor,
    rx: defaultDescriptor,
    ry: defaultDescriptor
  })
);

export const FluidLine = createFluidComponent<LineProps, ViewStyle>(
  Line,
  false,
  undefined,
  () => ({
    x1: defaultDescriptor,
    y1: defaultDescriptor,
    x2: defaultDescriptor,
    y2: defaultDescriptor
  })
);

export const FluidLinearGradient = createFluidComponent<
  LinearGradientProps,
  ViewStyle
>(LinearGradient, false, undefined, () => ({
  x1: defaultDescriptor,
  y1: defaultDescriptor,
  x2: defaultDescriptor,
  y2: defaultDescriptor
}));
