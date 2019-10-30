import { NavigationState } from "../types";

export const getNavigationStates = (
  index: number,
  navigationState: NavigationState,
) => {
  const states = [
    {
      name: NavigationState.None,
      active: navigationState === NavigationState.None,
    },
    {
      name: NavigationState.ForwardTo,
      active: navigationState === NavigationState.ForwardTo,
    },
    {
      name: NavigationState.ForwardFrom,
      active: navigationState === NavigationState.ForwardFrom,
    },
    {
      name: NavigationState.BackTo,
      active: navigationState === NavigationState.BackTo,
    },
    {
      name: NavigationState.BackFrom,
      active: navigationState === NavigationState.BackFrom,
    },
    {
      name: NavigationState.InTransition,
      active: navigationState !== NavigationState.None,
    },
    {
      name: NavigationState.Forward,
      active:
        navigationState === NavigationState.ForwardFrom ||
        navigationState === NavigationState.ForwardTo,
    },
    {
      name: NavigationState.Index,
      active: true,
      value: index,
    },
  ];
  return states;
};
