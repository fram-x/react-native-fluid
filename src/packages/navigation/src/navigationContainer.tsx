import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Fluid, {
  StateContext,
  DriverContext,
} from "react-native-fluid-transitions";
import { useNavigationState, useDriverContext, useCurrentValue } from "./Hooks";
import { getNavigationStates } from "./Functions";
import { useNavigation, useNavigationEvents } from "react-navigation-hooks";
import { StackAnimationProgressContext } from "react-navigation-stack";

type Props = {
  name: string;
};

export const FluidNavigationContainer: React.FC<Props> = ({
  name,
  ...props
}) => {
  const { navigationState, index } = useNavigationState(name);

  // Current
  const { current, duration, normalizedProgress } = useCurrentValue(
    name,
    navigationState,
  );

  // Driver context
  const driverContextValue = useDriverContext(
    name,
    navigationState,
    duration,
    current,
  );

  const states = getNavigationStates(index, navigationState);
  console.log(name, "NavState", navigationState);

  // Render
  return (
    <DriverContext.Provider value={driverContextValue}>
      <StateContext.Provider value={{ states }}>
        <Fluid.View
          staticStyle={[StyleSheet.absoluteFill]}
          label={"__NavContainer_" + name}
          {...props}
        />
      </StateContext.Provider>
    </DriverContext.Provider>
  );
};
