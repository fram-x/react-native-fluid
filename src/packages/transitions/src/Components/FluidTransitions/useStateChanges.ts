import { TransitionItem, StateChanges } from "../Types";
import { useRef } from "react";
import { useLog } from "../../Hooks/useLog";
import { LoggerLevel } from "../../Types";
import { ConfigStateType, SafeStateConfigType } from "../../Configuration";

export const useStateChanges = (
  transitionItem: TransitionItem,
  configuration: SafeStateConfigType
): StateChanges => {
  const logger = useLog(transitionItem.label, "state");

  const prevStates = useRef<Array<ConfigStateType>>([]);
  const nextStates = configuration.states;

  if (prevStates.current !== nextStates) {
    const stateChanges = getStateChanges(prevStates.current, nextStates);
    if (stateChanges) {
      const { changed, added, removed } = stateChanges;
      if (__DEV__) {
        logger(
          () =>
            "States changes " +
            (added.length > 0
              ? "a: [" + added.map(s => s.name).join(", ") + "], "
              : "") +
            (changed.length > 0
              ? "c: [" + changed.map(s => s.name).join(", ") + "], "
              : "") +
            (removed.length > 0
              ? "r: [" + removed.map(s => s.name).join(", ") + "], "
              : ""),
          LoggerLevel.Verbose
        );
      }
      prevStates.current = nextStates;
      return { changed, added, removed };
    }
  }
  return { added: [], removed: [], changed: [] };
};

function getStateChanges(
  prevStates: Array<ConfigStateType>,
  nextStates: Array<ConfigStateType>
): StateChanges | undefined {
  const statesAdded = nextStates.filter(nextState => {
    const prevState = prevStates.find(s2 => s2.name === nextState.name);
    return (
      (prevState &&
        prevState.active !== nextState.active &&
        nextState.active) ||
      (!prevState && nextState.value === undefined && nextState.active)
    );
  });

  const statesRemoved = nextStates.filter(nextState => {
    const prevState = prevStates.find(s2 => s2.name === nextState.name);
    return (
      prevState && prevState.active !== nextState.active && !nextState.active
    );
  });

  const statesChanged = prevStates.filter(nextState => {
    const prevState = nextStates.find(s2 => s2.name === nextState.name);
    return prevState && prevState.value !== nextState.value;
  });

  if (
    statesChanged.length === 0 &&
    statesAdded.length === 0 &&
    statesRemoved.length === 0
  )
    return undefined;

  return { changed: statesChanged, added: statesAdded, removed: statesRemoved };
}
