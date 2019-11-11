import React, { useContext, useMemo, useCallback } from "react";
import { ViewStyle } from "react-native";
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

type DraggableProps = ComponentProps<ViewStyle> & {
  onGestureEvent?: (event: PanGestureHandlerGestureEvent) => void;
  onHandlerStateChange?: (event: PanGestureHandlerStateChangeEvent) => void;
};

const TranslateX = "TranslateX";
const TranslateY = "TranslateY";
const VelocityX = "VelocityX";
const VelocityY = "VelocityY";

type GestureContaineComponentType = React.FC<DraggableProps> & {
  [TranslateX]: string;
  [TranslateY]: string;
  [VelocityX]: string;
  [VelocityY]: string;
};

const GestureContainerInternal: React.FC<DraggableProps> &
  Partial<GestureContaineComponentType> = ({ ...props }) => {
  const [isDraggingState, setIsDragging] = useFluidState(false);
  const stateContext = useContext(StateContext);

  // We're using state to avoid initializing too many values
  const translateX = useMemo(() => AnimationProvider.createValue(0), []);
  const translateY = useMemo(() => AnimationProvider.createValue(0), []);
  const velocityX = useMemo(() => AnimationProvider.createValue(0), []);
  const velocityY = useMemo(() => AnimationProvider.createValue(0), []);

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

  const onHandlerStateChange = useCallback(
    (event: PanGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.BEGAN) {
        setIsDragging(true);
      } else if (event.nativeEvent.oldState === State.ACTIVE) {
        setIsDragging(false);
        translateX.setValue(0);
        translateY.setValue(0);
      }
    },
    [setIsDragging, translateX, translateY],
  );

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

  const Component = useMemo(
    () =>
      createFluidComponent<DraggableProps, ViewStyle>(
        GestureComponent,
        true,
        () => {
          return {
            interpolators: {
              [TranslateX]: translateX,
              [TranslateY]: translateY,
              [VelocityX]: velocityX,
              [VelocityY]: velocityY,
            },
            props: {
              onGestureEvent,
              onHandlerStateChange,
            },
          };
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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

GestureContainerInternal[TranslateX] = TranslateX;
GestureContainerInternal[TranslateY] = TranslateY;
GestureContainerInternal[VelocityX] = VelocityX;
GestureContainerInternal[VelocityY] = VelocityY;

const GestureContainer = GestureContainerInternal as GestureContaineComponentType;

export { GestureContainer };
