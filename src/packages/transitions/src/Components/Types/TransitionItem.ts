import { SafeStateConfigType } from "../../Configuration";
import { Style } from "./StyleTypes";
import { Metrics } from "../../Types/MetricTypes";

export type TransitionItem = {
  id: number;
  label?: string;
  children: () => Array<TransitionItem>;
  metrics: () => Metrics;
  ref: () => any;
  getCalculatedStyles: () => Style;
  configuration: () => SafeStateConfigType;
  clone: (props: any) => React.ReactElement;
  isAlive: () => boolean;
  waitForMetrics: () => Promise<unknown>;
};
