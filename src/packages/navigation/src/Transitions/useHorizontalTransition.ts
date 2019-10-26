import { useNavigationTransition } from "./useNavigationTransition";

export const useHorizontalTransition = (width: number) => {
  const r = useNavigationTransition(
    "transform.translateX",
    [0, 0.5, 1],
    [0, -width, 0], // Forward from
    [width, width, 0], // Forward to
    [0, width, width], // Back from
    [-width, -width, 0], // Back to
  );
  return r;
};
