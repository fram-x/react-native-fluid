import React, { Context } from "react";
import { ConfigStateType } from "../../Configuration";

export type StateChanges = {
  added: Array<ConfigStateType>;
  changed: Array<ConfigStateType>;
  removed: Array<ConfigStateType>;
};

export interface StateContextType {
  states: Array<ConfigStateType>;
}

export const StateContext: Context<StateContextType | null> = React.createContext<StateContextType | null>(
  null
);
