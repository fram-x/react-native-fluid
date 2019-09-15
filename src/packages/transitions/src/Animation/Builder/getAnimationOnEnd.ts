import { OnAnimationFunction } from "../../Components/Types/InterpolationTypes";

export const getAnimationOnEnd = (
  length: number,
  onEnd: OnAnimationFunction | undefined
) => {
  if (onEnd === undefined) return undefined;
  let animationCount = length;
  return () => {
    animationCount--;
    if (animationCount === 0) {
      onEnd && onEnd();
    }
  };
};
