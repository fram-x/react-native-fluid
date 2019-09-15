import { TransitionItem } from "../Components/Types";
import { measureItemInLayout } from "../Utilities";
import { findNodeHandle } from "react-native";
import { MetricsInfo } from "../Types/MetricTypes";

export const getSharedInterpolationMetrics = async (
  ownerItem: TransitionItem,
  fromItem: TransitionItem,
  toItem: TransitionItem
): Promise<{ fromMetrics: MetricsInfo; toMetrics: MetricsInfo }> => {
  // We'll be using regular measure in layout here to avoid any
  // issues with measureInWindow and margins/borders etc.
  const ownerItemHandle = findNodeHandle(ownerItem.ref());
  const fromMetrics = await measureItemInLayout(
    ownerItemHandle,
    findNodeHandle(fromItem.ref())
  );
  const toMetrics = await measureItemInLayout(
    ownerItemHandle,
    findNodeHandle(toItem.ref())
  );

  return { fromMetrics, toMetrics };
};
