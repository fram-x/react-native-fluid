import React, { useMemo, useRef } from "react";
import * as T from "../../Types";
import {
  useConfiguration,
  useInterpolatorContext,
  useTransitionItems,
  useTouchable,
  useAnimationContext,
  useMountUpdate,
  useLayout,
  useValueInterpolation,
  useStyleContext,
  useStateChanges,
  useOnConfig,
  useWhenConfig,
  useInitialStyle,
  useInterpolatorConfig,
  useSharedInterpolation,
} from "../FluidTransitions";
import { TimingDefaultAnimationType } from "../../Utilities";
import {
  PartialInterpolatorInfo,
  TransitionItem,
  Style,
  SharedInterpolationContext,
  InterpolatorContext,
  AnimationContext,
  TransitionItemContext,
  ConfigurationContext,
  StateContext,
} from "../Types";
import { usePropContext } from "./usePropContext";
import { getMergedStyles } from "../../Styles/getMergedStyles";
import { getResolvedStyle } from "../../Styles/getResolvedStyle";
import { getResolvedLabel } from "../../Types";

let TransitionId = 1;

/**
 * @description Creates a Higher order component that wraps the animated
 * component and builds a Fluid Transition component
 * @param Component Component to be rendered
 * @param hasChildren If the component has children
 * @param setupInterpolators Callback to set up interpolators
 */
export function withFluidTransitions<BasePropType, StyleType>(
  Component: React.ComponentType<
    BasePropType & T.TouchableComponentProps<StyleType>
  >,
  hasChildren: boolean,
  setupInterpolators?: (props: BasePropType) => PartialInterpolatorInfo,
  getAnimatedPropDescriptors?: () => T.ValueDescriptorsType,
): React.ComponentType<BasePropType & T.TouchableComponentProps<StyleType>> {
  // Resolve prop descriptors
  const propDescriptors = getAnimatedPropDescriptors
    ? getAnimatedPropDescriptors()
    : {};

  // Component
  // @ts-ignore
  const AnimationContextComponent: React.FC<
    BasePropType & T.TouchableComponentProps<StyleType>
  > = ({
    label,
    style,
    staticStyle,
    initialStyle,
    children,
    onLayout,
    onPress,
    onPressIn,
    onPressOut,
    states,
    config,
    onAnimationDone,
    onAnimationBegin,
    animation,
    // @ts-ignore
    ...rest
  }) => {
    /******************************************************
     * Setup
     ******************************************************/
    const transitionId = useMemo(() => TransitionId++, []);
    const componentRef = useRef(null);

    // Create transition item
    const transitionItemRef = useRef<TransitionItem>();
    if (!transitionItemRef.current) {
      transitionItemRef.current = {
        id: transitionId,
        label: getResolvedLabel(label),
        children: () => transitionItems,
        metrics: () => metrics,
        isAlive: () => isAliveRef.current,
        waitForMetrics: () => waitForLayout,
        configuration: () => configuration,
        ref: () => componentRef.current,
        getCalculatedStyles: () => getCalculatedStyles(),
        clone: (props: BasePropType) => cloneElement(props),
      };
    } else {
      transitionItemRef.current.children = () => transitionItems;
      transitionItemRef.current.metrics = () => metrics;
      transitionItemRef.current.configuration = () => configuration;
      transitionItemRef.current.ref = () => componentRef.current;
      transitionItemRef.current.getCalculatedStyles = () =>
        getCalculatedStyles();
      transitionItemRef.current.clone = (props: BasePropType) =>
        cloneElement(props);
      transitionItemRef.current.isAlive = () => isAliveRef.current;
      transitionItemRef.current.waitForMetrics = () => waitForLayout;
    }

    const transitionItem = transitionItemRef.current;

    /******************************************************
     * Initialize hooks
     ******************************************************/

    // Layout context
    const { metrics, handleOnLayout, waitForLayout } = useLayout(
      transitionItem,
      onLayout,
    );

    // // Touchable
    const { render: renderTouchable } = useTouchable(
      onPress,
      onPressIn,
      onPressOut,
    );

    // Configuration
    const {
      configuration,
      resolvedChildDirection,
      animationTypeContext,
      stateContext,
    } = useConfiguration(transitionItem, config, states);

    // Resolved direction
    const currentDirection =
      configuration.childAnimation.direction || resolvedChildDirection;

    // Interpolator context
    const { interpolatorContext, extraProps } = useInterpolatorContext(
      transitionItem,
      rest,
      setupInterpolators,
    );

    // Transition items context
    const {
      transitionItems,
      transitionItemContext,
      isAliveRef,
    } = useTransitionItems(transitionItem);

    // Mounted context
    const isMounted = useMountUpdate(transitionItem, configuration);

    // Animation context
    const animationContext = useAnimationContext(
      isMounted,
      transitionItem,
      animation,
    );

    // Interpolated styles
    const { getCalculatedStyles, styleContext } = useStyleContext(
      transitionItem,
      animationContext,
      style as Style | Style[] | number | undefined,
    );

    // Interpolated properties
    const { getAnimatedProps, propContext } = usePropContext<BasePropType>(
      transitionItem,
      animationContext,
      rest as BasePropType,
      propDescriptors,
    );

    // Unmounted/initial style
    useInitialStyle(
      transitionItem,
      initialStyle as Style | Style[] | number | undefined,
      isMounted,
      styleContext,
      animation || configuration.animation,
      onAnimationBegin,
      onAnimationDone,
    );

    // Style and prop changes
    useValueInterpolation(
      transitionItem,
      styleContext,
      propContext,
      animation || configuration.animation,
      onAnimationBegin,
      onAnimationDone,
    );

    // Interpolator conig
    useInterpolatorConfig(
      transitionItem,
      styleContext,
      propContext,
      interpolatorContext,
      configuration,
      isMounted,
    );

    // Shared interpolation context
    const {
      renderSharedOverlay,
      sharedInterpolationContext,
    } = useSharedInterpolation(
      transitionItem,
      transitionItemContext,
      configuration,
      stateContext,
      currentDirection,
    );

    // State changes
    const stateChanges = useStateChanges(transitionItem, configuration);

    // When configuration
    useWhenConfig(
      transitionItem,
      styleContext,
      propContext,
      stateChanges,
      configuration,
      animation || configuration.animation || TimingDefaultAnimationType,
    );

    // On Configuration
    useOnConfig(
      transitionItem,
      styleContext,
      propContext,
      stateChanges,
      configuration,
      sharedInterpolationContext,
      animation || configuration.animation || TimingDefaultAnimationType,
    );

    /******************************************************
     * Functions
     ******************************************************/

    const FluidComponent = useMemo(
      () =>
        withFluidTransitions<BasePropType, StyleType>(
          Component,
          hasChildren,
          setupInterpolators,
        ),
      [],
    );

    const cloneElement = (
      p: BasePropType,
    ): React.ReactElement<BasePropType> => {
      return <FluidComponent {...props} {...p} ref={null} />;
    };

    /******************************************************
     * Render
     ******************************************************/

    const resolvedStaticStyle = getResolvedStyle(staticStyle || undefined);
    const styles = getMergedStyles([
      ...resolvedStaticStyle,
      getCalculatedStyles(),
    ]);

    const props = {
      ...rest,
      ...extraProps,
      ...getAnimatedProps(),
      style: styles,
      onLayout: handleOnLayout,
      children,
      collapsable: false,
      ref: componentRef,
    };

    // Without children we don't need any context either
    if (React.Children.count(children) === 0) {
      return renderTouchable(
        renderSharedOverlay(Component, props, hasChildren),
        props,
      );
    }

    return (
      <SharedInterpolationContext.Provider value={sharedInterpolationContext}>
        <InterpolatorContext.Provider value={interpolatorContext}>
          <AnimationContext.Provider value={animationContext}>
            <TransitionItemContext.Provider value={transitionItemContext}>
              <ConfigurationContext.Provider value={animationTypeContext}>
                <StateContext.Provider value={stateContext}>
                  {renderTouchable(
                    renderSharedOverlay(Component, props, hasChildren),
                    props,
                  )}
                </StateContext.Provider>
              </ConfigurationContext.Provider>
            </TransitionItemContext.Provider>
          </AnimationContext.Provider>
        </InterpolatorContext.Provider>
      </SharedInterpolationContext.Provider>
    );
  };

  return React.memo(AnimationContextComponent) as React.ComponentType<
    BasePropType & T.TouchableComponentProps<StyleType>
  >;
}
