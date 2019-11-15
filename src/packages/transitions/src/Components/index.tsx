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
import {
  ValueDescriptorsType,
  ValueDescriptorType,
  ComponentProps,
} from "../Types";
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
  interpolateKey: "value",
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

export const ScrollX = "ScrollX";
export const ScrollY = "ScrollY";

export type TransitionScrollViewType = React.FC<ComponentProps<ViewStyle>> & {
  [ScrollX]: string;
  [ScrollY]: string;
};

const TransitionScrollViewInternal = createFluidComponent<
  ScrollViewProps,
  ViewStyle
>(
  ScrollView,
  true,
  () => {
    // Setup scrollview interpolator
    const scrollX = AnimationProvider.createValue(0);
    const scrollY = AnimationProvider.createValue(0);
    return {
      interpolators: { [ScrollX]: scrollX, [ScrollY]: scrollY },
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
) as React.FC<ScrollViewProps> & Partial<TransitionScrollViewType>;

TransitionScrollViewInternal.ScrollX = ScrollX;
TransitionScrollViewInternal.ScrollY = ScrollY;

const TransitionScrollView: TransitionScrollViewType = TransitionScrollViewInternal as TransitionScrollViewType;

export {
  TransitionView,
  TransitionImage,
  TransitionText,
  TransitionScrollView,
  createFluidComponent,
};

export const NodeCallInfo = { nodeCallCount: 0, totalCount: 0 };
// import MessageQueue from "react-native/Libraries/BatchedBridge/MessageQueue.js";
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
//       NodeCallInfo.nodeCallCount++;
//       NodeCallInfo.totalCount++;
//       const type = data.args[1].type;
//       if (type === "callfunc") {
//         console.log(
//           NodeCallInfo.nodeCallCount,
//           "[total: " + NodeCallInfo.totalCount + "]",
//           type,
//           "(" + data.args[1].params.length + ")",
//         );
//       } else {
//         console.log(
//           NodeCallInfo.nodeCallCount,
//           "[total: " + NodeCallInfo.totalCount + "]",
//           type,
//         );
//       }
//     }
//   }
// };
// MessageQueue.spy(spyFunction);
