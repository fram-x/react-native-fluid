import { AnimationProvider } from "react-native-fluid-animations";
import {
  TimingMicroAnimationType,
  SpringGentleAnimationType
} from "../../Utilities";
import {
  interpolateColor,
  interpolateValue
} from "../../Animation/Runner/Functions";
import { ValueDescriptorType, ValueDescriptorsType } from "../../Types";

const defaultGetDisplayValue = (p: any) => p;

const defaultSpringAnimation = SpringGentleAnimationType;
const defaultTimingAnimation = TimingMicroAnimationType;

const RotateType: ValueDescriptorType = {
  getNumericValue: AnimationProvider.getNumericRotation,
  getDisplayValue: AnimationProvider.getRadianDisplayValue,
  interpolate: interpolateValue,
  defaultValue: "0rad",
  extrapolate: "extend",
  defaultAnimation: defaultSpringAnimation
};

const NumericSpringType = (defaultValue: number): ValueDescriptorType => ({
  getNumericValue: defaultGetDisplayValue,
  getDisplayValue: AnimationProvider.getDisplayValue,
  interpolate: interpolateValue,
  defaultValue: defaultValue,
  extrapolate: "extend",
  defaultAnimation: defaultSpringAnimation
});

const NumericTimingType = (defaultValue: number): ValueDescriptorType => ({
  getNumericValue: defaultGetDisplayValue,
  getDisplayValue: AnimationProvider.getDisplayValue,
  interpolate: interpolateValue,
  defaultValue: defaultValue,
  extrapolate: "extend",
  defaultAnimation: defaultTimingAnimation
});

const ColorType: ValueDescriptorType = {
  getNumericValue: AnimationProvider.getNumericColor,
  getDisplayValue: AnimationProvider.getColorDisplayValue,
  interpolate: interpolateColor,
  defaultValue: 0,
  extrapolate: "clamp",
  defaultAnimation: defaultTimingAnimation
};

export const AnimatedStyleKeys: ValueDescriptorsType = {
  "transform.rotate": RotateType,
  "transform.rotateX": RotateType,
  "transform.rotateY": RotateType,
  "transform.rotateZ": RotateType,
  "transform.perspective": NumericSpringType(0),
  "transform.scale": NumericSpringType(1),
  "transform.scaleX": NumericSpringType(1),
  "transform.scaleY": NumericSpringType(1),
  "transform.translateX": NumericSpringType(0),
  "transform.translateY": NumericSpringType(0),
  "transform.skewX": RotateType,
  "transform.skewY": RotateType,
  left: NumericSpringType(0),
  top: NumericSpringType(0),
  width: NumericSpringType(0),
  height: NumericSpringType(0),
  borderRadius: NumericTimingType(0),
  borderWidth: NumericTimingType(0),
  borderBottomWidth: NumericTimingType(0),
  borderTopWidth: NumericTimingType(0),
  borderLeftWidth: NumericTimingType(0),
  borderRightWidth: NumericTimingType(0),
  borderStartWidth: NumericTimingType(0),
  borderEndWidth: NumericTimingType(0),
  padding: NumericTimingType(0),
  paddingTop: NumericTimingType(0),
  paddingLeft: NumericTimingType(0),
  paddingRight: NumericTimingType(0),
  paddingBottom: NumericTimingType(0),
  margin: NumericTimingType(0),
  marginTop: NumericTimingType(0),
  marginLeft: NumericTimingType(0),
  marginRight: NumericTimingType(0),
  marginBottom: NumericTimingType(0),
  marginVertical: NumericTimingType(0),
  marginHorizontal: NumericTimingType(0),
  opacity: NumericTimingType(1),
  fontSize: NumericTimingType(12),
  flex: NumericTimingType(1),
  color: ColorType,
  backgroundColor: ColorType,
  borderColor: ColorType,
  borderTopColor: ColorType,
  borderLeftColor: ColorType,
  borderBottomColor: ColorType,
  borderRightColor: ColorType
};
