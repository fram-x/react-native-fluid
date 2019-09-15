import { findNodeHandle, UIManager } from "react-native";
import { MetricsInfo } from "../Types";

export const measureItemInWindow = (
  comp: null | number | React.Component<any, any> | React.ComponentClass<any>
): Promise<MetricsInfo> => {
  const nodeHandle = findNodeHandle(comp);
  if (!nodeHandle) {
    return Promise.reject(
      "Fluid Transitions: Node handle not found for component"
    );
  }
  return new Promise(resolve => {
    UIManager.measureInWindow(nodeHandle, (x, y, width, height) => {
      resolve({ x, y, width, height });
    });
  });
};

export const measureItemInLayout = (
  inLayout:
    | null
    | number
    | React.Component<any, any>
    | React.ComponentClass<any>,
  comp: null | number | React.Component<any, any> | React.ComponentClass<any>
): Promise<MetricsInfo> => {
  const nodeHandle = findNodeHandle(comp);
  const parentHandle = findNodeHandle(inLayout);
  if (!nodeHandle || !parentHandle) {
    return Promise.reject(
      "Fluid Transitions: Node handle not found for component"
    );
  }
  return new Promise((resolve, reject) => {
    UIManager.measureLayout(
      nodeHandle,
      parentHandle,
      () => reject(),
      (x, y, width, height) => {
        resolve({ x, y, width, height });
      }
    );
  });
};
