import { StyleProp } from "react-native";
import { OnAnimationFunction, EasingFunction } from "../Components/Types";
import { ExtrapolateType } from "react-native-fluid-animations";
import { MetricsInfo, Metrics } from "../Types";

type EnumLiteralsOf<T extends Object> = T[keyof T];

export type OnTypeEnum = EnumLiteralsOf<typeof OnTypeEnum>;
export const OnTypeEnum = Object.freeze({
  Enter: "enter" as "enter",
  Exit: "exit" as "exit",
});

export type OnFactoryResult = {
  interpolation: ConfigStyleInterpolationType | ConfigStyleInterpolationType[];
  animation?: ConfigAnimationType;
};

export type OnFactoryFunction = ({
  screenSize,
  metrics,
  state,
  stateValue,
  type,
}: {
  screenSize: { width: number; height: number };
  metrics: Metrics;
  state: string;
  stateValue?: number | string | boolean;
  type: OnTypeEnum;
}) => OnFactoryResult;

export type WhenFactoryResult = {
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[]
    | ConfigValueInterpolationType
    | ConfigValueInterpolationType[];
  animation?: ConfigAnimationType;
};

export type WhenFactoryFunction = ({
  screenSize,
  metrics,
  state,
  stateValue,
}: {
  screenSize: { width: number; height: number };
  metrics: Metrics;
  state: string;
  stateValue?: number | string | boolean;
}) => WhenFactoryResult;

export type StateType = {
  active?: boolean;
  name: string;
  value?: Object;
};

export type ChildAnimationDirection = EnumLiteralsOf<
  typeof ChildAnimationDirection
>;
export const ChildAnimationDirection = Object.freeze({
  Forward: "forward" as "forward",
  Backward: "backward" as "backward",
});

/**
 * @type Defines a state
 */
export type ConfigStateType = {
  name: string;
  active?: boolean;
  value?: number | string | boolean;
  negated?: ConfigStateType;
};

export const isConfigStateType = (obj: any): obj is ConfigStateType => {
  return (obj as ConfigStateType).active !== undefined;
};

/**
 * @description Callback function for calculating stagger offset values in ms.
 * @param index Index of item we are calculating offset for
 * @param metrics Metrics of item we are calculating offset for
 * @returns Offset from start in milliseconds for staggering item with index
 */
export type ConfigStaggerFunction = (
  parentMetrics: MetricsInfo,
  childMetrics: Array<MetricsInfo>,
) => number[];

type BaseConfigChildAnimationType = {
  direction?: ChildAnimationDirection;
};
/**
 * @type Describes the animation type animating children
 */
export type ConfigSequentialChildAnimationType = BaseConfigChildAnimationType & {
  type: "sequential";
};

export type ConfigParallelChildAnimationType = BaseConfigChildAnimationType & {
  type: "parallel";
};

export type ConfigStaggeredChildAnimationType = BaseConfigChildAnimationType & {
  type: "staggered";
  stagger?: number | ConfigStaggerFunction;
};

export type ConfigChildAnimationType =
  | ConfigSequentialChildAnimationType
  | ConfigParallelChildAnimationType
  | ConfigStaggeredChildAnimationType;

/**
 * @type Defines animation types for configuration elements
 */
export type ConfigTimingAnimationType = {
  type: "timing";
  duration: number;
  delay?: number;
  easing?: EasingFunction;
};

export type ConfigSpringAnimationType = {
  type: "spring";
  delay?: number;
  mass: number;
  stiffness: number;
  damping: number;
};

export type ConfigAnimationType =
  | ConfigTimingAnimationType
  | ConfigSpringAnimationType;

export const isConfigAnimationTiming = (
  obj: ConfigAnimationType,
): obj is ConfigTimingAnimationType => {
  return (obj as ConfigTimingAnimationType).type === "timing";
};

export const isConfigAnimationSpring = (
  obj: ConfigAnimationType,
): obj is ConfigSpringAnimationType => {
  return (obj as ConfigSpringAnimationType).type === "spring";
};

/**
 * @type Defines an interpolator value identifier.
 */
export type ConfigInterpolatorType = {
  ownerLabel: string;
  valueName: string;
};

/**
 * @type Defines the base interpolation type
 */
export type BaseConfigInterpolationType = {
  inputRange?: Array<number>;
  outputRange: Array<number | string>;
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
  animation?: ConfigAnimationType;
};

/**
 * @type Defines an interpolation between style values
 */
export type ConfigStyleInterpolationType = BaseConfigInterpolationType & {
  styleKey: string;
};

/**
 * @type Defines an interpolation between prop values
 */
export type ConfigPropInterpolationType = BaseConfigInterpolationType & {
  propName: string;
};

/**
 * @type Defines an interpolation driven by an interpolator value
 */
export type ConfigValueInterpolationType = ConfigStyleInterpolationType & {
  value: ConfigInterpolatorType;
};

type BaseConfigType = {
  animation?: ConfigAnimationType;
  onBegin?: OnAnimationFunction;
  onEnd?: OnAnimationFunction;
  loop?: number;
  flip?: number;
  yoyo?: number;
};

/**
 * @type Defines a style change or interpolation that should be added
 * when a given state is active.
 */
export type ConfigWhenStyleType = BaseConfigType & {
  state: string | ConfigStateType;
  style: StyleProp<any>;
};

export type ConfigWhenInterpolationType = BaseConfigType & {
  state: string | ConfigStateType;
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[]
    | ConfigValueInterpolationType
    | ConfigValueInterpolationType[];
};

export type ConfigWhenFactoryType = BaseConfigType & {
  state: string | ConfigStateType;
  whenFactory: WhenFactoryFunction;
};

export type ConfigWhenType =
  | ConfigWhenStyleType
  | ConfigWhenInterpolationType
  | ConfigWhenFactoryType;

export const isConfigWhenStyle = (
  obj: ConfigWhenType,
): obj is ConfigWhenStyleType => {
  return (obj as ConfigWhenStyleType).style !== undefined;
};

export const isConfigWhenInterpolation = (
  obj: ConfigWhenType,
): obj is ConfigWhenInterpolationType => {
  return (obj as ConfigWhenInterpolationType).interpolation !== undefined;
};

export const isConfigWhenFactory = (
  obj: ConfigWhenType,
): obj is ConfigWhenFactoryType => {
  return (obj as ConfigWhenFactoryType).whenFactory !== undefined;
};

/**
 * @type Defines an interpolation that will be added when a given state enters or exits.
 */
export type BaseConfigOnType = {
  state: string | ConfigStateType;
  animation?: ConfigAnimationType;
  onBegin?: OnAnimationFunction;
  onEnd?: OnAnimationFunction;
  loop?: number;
  flip?: number;
  yoyo?: number;
};

export const getResolvedStateName = (state: string | ConfigStateType) => {
  if (typeof state === "string") {
    return state;
  }
  return (state as ConfigStateType).name;
};

export type ConfigOnInterpolationType = BaseConfigOnType & {
  interpolation:
    | ConfigPropInterpolationType
    | ConfigPropInterpolationType[]
    | ConfigStyleInterpolationType
    | ConfigStyleInterpolationType[];
};

export type ConfigOnFactoryType = BaseConfigOnType & {
  onFactory: OnFactoryFunction;
};

export type ConfigOnSharedType = BaseConfigOnType & {
  fromLabel: string;
};

export type ConfigOnType =
  | ConfigOnInterpolationType
  | ConfigOnFactoryType
  | ConfigOnSharedType;

export const isConfigOnShared = (
  obj: ConfigOnType,
): obj is ConfigOnSharedType => {
  return (obj as ConfigOnSharedType).fromLabel !== undefined;
};

export const isConfigOnInterpolation = (
  obj: ConfigOnType,
): obj is ConfigOnInterpolationType => {
  return (obj as ConfigOnInterpolationType).interpolation !== undefined;
};

export const isConfigOnFactory = (
  obj: ConfigOnType,
): obj is ConfigOnFactoryType => {
  return (obj as ConfigOnFactoryType).onFactory !== undefined;
};

export const isConfigWhenValueInterplation = (
  obj: BaseConfigInterpolationType,
): obj is ConfigValueInterpolationType => {
  return (obj as ConfigValueInterpolationType).value !== undefined;
};

export const isConfigStyleInterpolation = (
  obj: BaseConfigInterpolationType,
): obj is ConfigStyleInterpolationType => {
  return (obj as ConfigStyleInterpolationType).styleKey !== undefined;
};

export const isConfigPropInterpolation = (
  obj: BaseConfigInterpolationType,
): obj is ConfigPropInterpolationType => {
  return (obj as ConfigPropInterpolationType).propName !== undefined;
};

/**
 * @type Defines the main configuration object schema
 */
export type ConfigType = {
  animation?: ConfigAnimationType;
  childAnimation?: ConfigChildAnimationType;
  when?: ConfigWhenType | ConfigWhenType[];
  onEnter?: ConfigOnType | ConfigOnType[];
  onExit?: ConfigOnType | ConfigOnType[];
  interpolation?:
    | ConfigValueInterpolationType
    | Array<ConfigValueInterpolationType>;
};

/**
 * @type Safe configuration type. This is the types that are used internally
 * after reading config the configuration property.
 */
export type SafeConfigType = {
  animation?: ConfigAnimationType;
  childAnimation: ConfigChildAnimationType;
  when: ConfigWhenType[];
  onEnter: ConfigOnType[];
  onExit: ConfigOnType[];
  interpolation: ConfigValueInterpolationType[];
};

/**
 * @type Safe configuration type with states.
 */
export type SafeStateConfigType = SafeConfigType & {
  states: ConfigStateType[];
};
