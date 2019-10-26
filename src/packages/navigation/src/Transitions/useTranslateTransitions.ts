import {
  useAllDirectionTransition,
  useDirectionTransition,
} from "./useNavigationTransition";

export const useHorizontalTransition = (width: number) => {
  return useAllDirectionTransition("transform.translateX", width);
};

export const useVerticalTransition = (height: number) => {
  return useAllDirectionTransition("transform.translateY", height);
};

export const useTopTransition = (height: number) => {
  return useDirectionTransition("transform.translateY", -height);
};

export const useBottomTransition = (height: number) => {
  return useDirectionTransition("transform.translateY", height);
};

export const useLeftTransition = (width: number) => {
  return useDirectionTransition("transform.translateY", -width);
};

export const useRightTransition = (width: number) => {
  return useDirectionTransition("transform.translateY", width);
};
