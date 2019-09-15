import Animated, { Easing } from "react-native-reanimated";
import { IAnimationValue } from "../../Types";
// @ts-ignore
import { always } from "react-native-reanimated/src/base";
const {
  Clock,
  Value,
  block,
  timing,
  call,
  cond,
  stopClock,
  set,
  startClock,
  clockRunning,
  onChange
} = Animated;

export const runTiming = (
  master: IAnimationValue,
  duration: number,
  callback?: () => void
) => {
  const clock = new Clock();
  let animation: Animated.Node<number>;
  animation = always(
    internalRunTiming(
      clock,
      master as Animated.Value<number>,
      {
        toValue: duration,
        duration,
        easing: Easing.linear
      },
      () => {
        // @ts-ignore
        animation.__detach();
        callback && callback();
      }
    )
  );
  // @ts-ignore
  animation.__attach();
};

function internalRunTiming(
  clock: Animated.Clock,
  value: Animated.Value<number>,
  config: Animated.TimingConfig,
  callback: () => void
) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  return block([
    onChange(config.toValue, set(state.frameTime, 0)),
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(value, state.position),
      set(state.frameTime, 0),
      startClock(clock)
    ]),
    timing(clock, state, config),
    set(value, state.position),
    cond(state.finished, [stopClock(clock), call([], callback)])
  ]);
}
