import { useNavigationTransition } from "./useNavigationTransition";

export const useVerticalTransition = (height: number) => {
  useNavigationTransition(
    "transform.translateY",
    [0, 0.5, 1],
    [0, -height, 0], // Forward from
    [height, height, 0], // Forward to
    [0, height, height], // Back from
    [-height, -height, 0], // Back to
  );
};
