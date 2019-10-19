import {
  ImageProps,
  TextProps,
  ScrollViewProps,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ViewProps,
  Image,
  View,
  Text,
  ScrollView,
} from "react-native";
import { AnimationProvider } from "react-native-fluid-animations";
import { withFluidTransitions } from "./FluidTransitions/withFluidTransitions";
import { PartialInterpolatorInfo } from "./Types/InterpolatorContext";
import { ValueDescriptorsType, ValueDescriptorType } from "../Types";
import { SpringDefaultAnimationType } from "../Utilities";
import { interpolateValue } from "../Animation/Runner/Functions";

const DefaultGetValue = (p: any) => p;
const DefaultDescriptor: ValueDescriptorType = {
  defaultValue: 0,
  getDisplayValue: AnimationProvider.getDisplayValue,
  getNumericValue: DefaultGetValue,
  defaultAnimation: SpringDefaultAnimationType,
  extrapolate: "extend",
  interpolate: interpolateValue,
};

const getDefaultDescriptors = () => ({
  width: DefaultDescriptor,
  height: DefaultDescriptor,
  opacity: DefaultDescriptor,
});

function createFluidComponent<PropType, StyleType>(
  Component: any,
  hasChildren: boolean,
  setupInterpolators?: (props: PropType) => PartialInterpolatorInfo,
  getAnimatedPropDescriptors?: () => ValueDescriptorsType,
) {
  return withFluidTransitions<PropType, StyleType>(
    AnimationProvider.createAnimatedComponent(Component),
    hasChildren,
    setupInterpolators,
    getAnimatedPropDescriptors,
  );
}

const TransitionView = createFluidComponent<ViewProps, ViewStyle>(
  View,
  true,
  undefined,
  getDefaultDescriptors,
);

const TransitionImage = createFluidComponent<ImageProps, ImageStyle>(
  Image,
  false,
  undefined,
  getDefaultDescriptors,
);

const TransitionText = createFluidComponent<TextProps, TextStyle>(
  Text,
  false,
  undefined,
  getDefaultDescriptors,
);

const TransitionScrollView = createFluidComponent<ScrollViewProps, ViewStyle>(
  ScrollView,
  true,
  () => {
    // Setup scrollview interpolator
    const scrollX = AnimationProvider.createValue(0);
    const scrollY = AnimationProvider.createValue(0);
    return {
      interpolators: { scrollX, scrollY },
      props: {
        scrollEventThrottle: 4,
        onScroll: AnimationProvider.Animated.event([
          {
            nativeEvent: { contentOffset: { x: scrollX, y: scrollY } },
          },
        ]),
      },
    };
  },
  getDefaultDescriptors,
);

export {
  TransitionView,
  TransitionImage,
  TransitionText,
  TransitionScrollView,
  createFluidComponent,
};

// import MessageQueue from "react-native/Libraries/BatchedBridge/MessageQueue.js";
// let nodeCallCount = 0;
// const spyFunction = (data: SpyData) => {
//   const m = data.method;
//   if (
//     m
//       .toString()
//       .toLowerCase()
//       .includes("node") &&
//     !m.toString().includes("createAnimatedNode")
//   ) {
//     if (data.args.length === 2 && data.args[1].hasOwnProperty("type")) {
//       nodeCallCount++;
//       console.log(nodeCallCount, data.args[1].type);
//     }
//   }
// };
// MessageQueue.spy(spyFunction);
