import React from "react";
import { TransitionItem } from "./TransitionItem";

export type TransitionItemContextType = {
  registerTransitionItem: (item: TransitionItem) => void;
  unregisterTransitionItem: (id: number) => void;
  getTransitionItemByLabel: (label: string) => TransitionItem | undefined;
  getOwner: () => TransitionItem;
};

export const TransitionItemContext = React.createContext<
  TransitionItemContextType | undefined
>(undefined);
