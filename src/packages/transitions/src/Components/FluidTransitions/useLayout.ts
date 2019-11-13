import { useRef, useCallback, useMemo } from "react";
import { Metrics, MetricsInfo, LoggerLevel } from "../../Types";
import { LayoutChangeEvent, InteractionManager, Platform } from "react-native";
import { measureItemInWindow } from "../../Utilities";
import { TransitionItem } from "../Types";
import { useLog } from "../../Hooks";

export const useLayout = (
  transitionItem: TransitionItem,
  onLayout?: (event: LayoutChangeEvent) => void,
) => {
  const isFirstMeasure = useRef(true);
  const metrics = useRef(new Metrics(-1, -1, -1, -1));
  const logger = useLog(transitionItem.label, "metrc");

  // Wait for layout
  const waitForLayoutResolve = useRef<Function | null>(null);
  const previousLayoutMetrics = useRef<MetricsInfo>();
  const waitForLayout = useMemo(
    () => new Promise(resolve => (waitForLayoutResolve.current = resolve)),
    [],
  );

  const handleOnLayout = useCallback((evt: LayoutChangeEvent) => {
    logger(() => `onLayout: ${transitionItem.label}...`, LoggerLevel.Detailed);
    const { layout } = evt.nativeEvent;
    const nextMetrics: MetricsInfo = { ...layout };
    if (
      !previousLayoutMetrics.current ||
      (previousLayoutMetrics.current.x !== nextMetrics.x ||
        previousLayoutMetrics.current.y !== nextMetrics.y ||
        previousLayoutMetrics.current.width !== nextMetrics.width ||
        previousLayoutMetrics.current.height !== nextMetrics.height)
    ) {
      previousLayoutMetrics.current = nextMetrics;
      if (isFirstMeasure.current) {
        isFirstMeasure.current = false;
        if (Platform.OS === "android") {
          measureAsync();
        } else {
          InteractionManager.runAfterInteractions(measureAsync);
        }
      } else {
        measureAsync();
      }
    }

    // Call old onLayout
    onLayout && onLayout(evt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const measureAsync = useCallback(() => {
    return measureItemInWindow(transitionItem.ref()).then(
      ({ x, y, width: w, height: h }: MetricsInfo) => {
        if (__DEV__) {
          logger(
            () =>
              `Measured ${transitionItem.label}: (${x.toFixed(0)}, ${y.toFixed(
                0,
              )}, ${w.toFixed(0)}, ${h.toFixed(0)})`,
            LoggerLevel.Detailed,
          );
        }
        metrics.current.setValues(x, y, w, h);
        waitForLayoutResolve.current && waitForLayoutResolve.current();
        waitForLayoutResolve.current = null;
      },
    );
  }, [logger, transitionItem]);

  return {
    handleOnLayout: handleOnLayout,
    metrics: metrics.current,
    waitForLayout,
  };
};
