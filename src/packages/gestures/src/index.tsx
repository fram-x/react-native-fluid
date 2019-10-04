import React, { useState, useContext } from "react";
import { ViewProps, ViewStyle } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from "react-native-gesture-handler";
import { AnimationProvider } from "react-native-fluid-animations";
import {
  createFluidComponent,
  StateContext,
  useFluidState,
  ComponentProps,
} from "react-native-fluid-transitions";

type Props = {};

type DraggableProps = ComponentProps<ViewProps> & {
  onGestureEvent?: (event: PanGestureHandlerGestureEvent) => void;
  onHandlerStateChange?: (event: PanGestureHandlerStateChangeEvent) => void;
};

export const GestureContainer: React.FC<DraggableProps> = ({ ...props }) => {
  const [isDraggingState, setIsDragging] = useFluidState(false);
  const stateContext = useContext(StateContext);

  // We're using state to avoid initializing too many values
  const [translateX] = useState(() => AnimationProvider.createValue(0));
  const [translateY] = useState(() => AnimationProvider.createValue(0));
  const [velocityX] = useState(() => AnimationProvider.createValue(0));
  const [velocityY] = useState(() => AnimationProvider.createValue(0));

  const onGestureEvent = AnimationProvider.Animated.event([
    {
      nativeEvent: {
        translationX: translateX,
        translationY: translateY,
        velocityX: velocityX,
        velocityY: velocityY,
      },
    },
  ]);

  const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN) {
      console.log("dragging");
      setIsDragging(true);
    } else if (event.nativeEvent.oldState === State.ACTIVE) {
      console.log("dragging stop");
      setIsDragging(false);
    }
  };

  class GestureComponent extends React.PureComponent<DraggableProps> {
    render() {
      const { style, ...rest } = this.props;
      return (
        <PanGestureHandler
          onGestureEvent={onGestureEvent as any}
          onHandlerStateChange={onHandlerStateChange}>
          <AnimationProvider.Types.View {...rest} style={style} />
        </PanGestureHandler>
      );
    }
  }

  const [Component] = useState(() =>
    createFluidComponent<DraggableProps, ViewStyle>(
      GestureComponent,
      false,
      () => {
        return {
          interpolators: {
            translateX,
            translateY,
            velocityX,
            velocityY,
          },
          props: {
            onGestureEvent,
            onHandlerStateChange,
          },
        };
      },
    ),
  );

  const states = [
    ...(stateContext ? stateContext.states : []),
    { ...isDraggingState, name: "dragging" },
  ];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component {...props} />
    </StateContext.Provider>
  );
};
