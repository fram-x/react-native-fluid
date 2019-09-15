import {
  SharedInterpolationType,
  SharedInterpolationStatus
} from "../Components/Types";

export const createOnAnimationDone = (
  sharedInterpolation: SharedInterpolationType,
  sharedTransitions: Array<SharedInterpolationType>,
  onTransitionDone: () => void
) => {
  // On Animation done
  return (sharedInterpolation.onAnimationDone = () => {
    // Find shared element
    const sharedItem = sharedTransitions.find(
      s => s.id === sharedInterpolation.id
    );
    if (
      sharedItem &&
      sharedInterpolation.status === SharedInterpolationStatus.Active
    ) {
      // Mark as dead
      sharedInterpolation.status = SharedInterpolationStatus.Done;
      onTransitionDone();
    }
  });
};
