import {
  AnimationProvider,
  IAnimationNode
} from "react-native-fluid-animations";
import { EasingFunction } from "../../Components/Types/Easing";

const {
  exp,
  proc,
  sin,
  cos,
  divide,
  add,
  multiply,
  sub
} = AnimationProvider.Animated;

export type SpringEasingInfo = {
  easing: EasingFunction;
  duration: number;
};

export const createSpring = (
  from: number,
  to: number,
  mass: number,
  stiffness: number,
  damping: number,
  velocity?: number
): SpringEasingInfo => {
  const key = JSON.stringify({ from, to, damping, stiffness, mass });
  if (!springCache[key]) {
    // Let's find the duration
    const { duration } = getCachedSpring(
      from,
      to,
      mass,
      stiffness,
      damping,
      velocity
    );
    const springFunction = createSpringFunction(
      key,
      duration,
      mass,
      stiffness,
      damping,
      0
    );
    Object.defineProperty(springFunction, "name", { value: key });
    springCache[key] = {
      easing: springFunction,
      duration
    };
  }
  return springCache[key];
};

const createSpringFunction = (
  key: string,
  duration: number,
  mass: number,
  stiffness: number,
  damping: number,
  initialVelocity: number
) => {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  const a = 1;
  const b =
    zeta < 1 ? (zeta * w0 + -initialVelocity) / wd : -initialVelocity + w0;

  const springBody = (t: IAnimationNode) => {
    let progress = divide(multiply(duration, t), 1000);
    let result: IAnimationNode;
    if (zeta < 1) {
      /*
          Math.exp(-progress * zeta * w0) *
          (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      */
      result = multiply(
        exp(multiply(multiply(multiply(-1, progress), zeta), w0)),
        add(
          multiply(a, cos(multiply(wd, progress))),
          multiply(b, sin(multiply(wd, progress)))
        )
      );
    } else {
      /*
         (a + b * progress) * Math.exp(-progress * w0);
      */
      result = multiply(
        add(a, multiply(b, progress)),
        exp(multiply(multiply(-1, progress), w0))
      );
    }
    // return 1 - progress;
    return sub(1, result);
  };

  return proc(`spring-${key}`, t => springBody(t));
};

// https://github.com/juliangarnier/anime/blob/master/lib/anime.es.js#L82
const springCache: { [key: string]: SpringEasingInfo } = {};
export const getCachedSpring = (
  from: number,
  to: number,
  mass: number,
  stiffness: number,
  damping: number,
  initialVelocity: number = 0
): SpringEasingInfo => {
  const key = JSON.stringify({ from, to, damping, stiffness, mass });
  if (!springCache[key]) {
    // Create easing function
    const w0 = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    const wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
    const a = 1;
    const b =
      zeta < 1 ? (zeta * w0 + -initialVelocity) / wd : -initialVelocity + w0;

    const springFunction = (t: number, duration?: number) => {
      let progress = duration ? (duration * t) / 1000 : t;
      if (zeta < 1) {
        progress =
          Math.exp(-progress * zeta * w0) *
          (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
      } else {
        progress = (a + b * progress) * Math.exp(-progress * w0);
      }
      if (t === 0 || t === 1) {
        return t;
      }
      return 1 - progress;
    };

    const getDuration = () => {
      var frame = 1 / 6;
      var elapsed = 0;
      var rest = 0;
      while (true) {
        elapsed += frame;
        if (springFunction(elapsed) === 1) {
          rest++;
          if (rest >= 16) {
            break;
          }
        } else {
          rest = 0;
        }
      }
      var duration = elapsed * frame * 1000;
      return duration;
    };

    // Calculate duration
    const duration = getDuration();
    springCache[key] = {
      easing: (t: any) => springFunction(t, duration),
      duration
    };
  }

  return springCache[key];
};
