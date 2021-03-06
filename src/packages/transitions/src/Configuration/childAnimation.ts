import {
  ConfigType,
  ConfigParallelChildAnimationType,
  ConfigStaggeredChildAnimationType,
  ConfigSequentialChildAnimationType,
  ConfigStaggerFunction,
  ChildAnimationDirection,
} from "./Types";
import { DefaultStaggerMs } from "../Types";

export function ChildAnimation(
  childAnimationType: ConfigSequentialChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType: ConfigParallelChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType: ConfigStaggeredChildAnimationType,
): ConfigType;

export function ChildAnimation(
  childAnimationType:
    | ConfigSequentialChildAnimationType
    | ConfigParallelChildAnimationType
    | ConfigStaggeredChildAnimationType,
): ConfigType {
  return { childAnimation: childAnimationType };
}

export function Staggered(
  stagger?: number | ConfigStaggerFunction,
  direction?: ChildAnimationDirection,
): ConfigType {
  return ChildAnimation({
    type: "staggered",
    stagger: stagger || DefaultStaggerMs,
    direction: direction || "forward",
  });
}

export function Sequential(): ConfigType {
  return ChildAnimation({ type: "sequential" });
}

export function Parallel(): ConfigType {
  return ChildAnimation({ type: "parallel" });
}
