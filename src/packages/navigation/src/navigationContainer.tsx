import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import TransitionContext from "@react-navigation/stack/src/utils/TransitionContext";
import Fluid, {
  StateContext,
  DriverContext,
} from "react-native-fluid-transitions";
import {
  useVisibilityStyle,
  useFadeConfig,
  useNavigationState,
  useDriverContext,
  useCurrentValue,
} from "./Hooks";
import { getNavigationStates } from "./Functions";

type Props = {
  name: string;
};

export const FluidNavigationContainer: React.FC<Props> = ({
  name,
  ...props
}) => {
  // Context
  const stateContext = useContext(StateContext);
  const transitionContext = useContext(TransitionContext);

  if (!transitionContext) throw Error("No transition context found.");

  const navigationState = useNavigationState(transitionContext);

  // Current
  const { current, duration } = useCurrentValue(name, transitionContext);

  // Driver context
  const driverContextValue = useDriverContext(
    name,
    navigationState,
    duration,
    current,
  );

  const states = getNavigationStates(
    navigationState,
    transitionContext,
    stateContext,
  );
  const config = useFadeConfig(states);
  const visibilityStyle = useVisibilityStyle(transitionContext.index);

  console.log(name, "NavState", navigationState);

  // Render
  return (
    <DriverContext.Provider value={driverContextValue}>
      <StateContext.Provider value={{ states }}>
        <Fluid.View
          config={config}
          staticStyle={StyleSheet.absoluteFill}
          style={visibilityStyle}
          label={"__NavContainer_" + name}
          {...props}
        />
      </StateContext.Provider>
    </DriverContext.Provider>
  );
};
