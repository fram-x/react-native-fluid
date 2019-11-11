import Animated from "react-native-reanimated";
import { IAnimationValue } from "../../Types";
// @ts-ignore
import { always } from "react-native-reanimated/src/base";

const {
  Clock,
  Value,
  sub,
  cond,
  greaterOrEq,
  call,
  stopClock,
  set,
  startClock,
  clockRunning,
} = Animated;

export const runTiming = (master: IAnimationValue, duration: number) => {
  const clock = new Clock();
  let timing: Animated.Node<number>;

  const startTime = new Value(0);
  const frameTime = sub(clock, startTime);
  const value = master as Animated.Value<number>;

  timing = always(
    cond(
      clockRunning(clock),
      [
        cond(greaterOrEq(frameTime, duration), [
          // Stop animation (duration has been reached)
          stopClock(clock),
          set(value, duration),
          call([], () =>
            // @ts-ignore
            timing.__detach(),
          ),
        ]),
        // Update animation value
        set(value, frameTime),
      ],
      [
        // Start (clock is not running)
        set(startTime, clock),
        set(value, frameTime),
        startClock(clock),
      ],
    ),
  );

  // @ts-ignore
  timing.__attach();
};
