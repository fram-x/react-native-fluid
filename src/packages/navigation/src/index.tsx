import React, { useContext, useMemo } from "react";
import { ViewStyle } from "react-native";
import {
  createFluidComponent,
  StateContext,
  useFluidState,
} from "react-native-fluid-transitions";

export const FluidNavigationContainer: React.FC = ({ ...props }) => {
  const [isNavigating, setIsNavigating] = useFluidState(false);
  const stateContext = useContext(StateContext);

  class NavigationComponent extends React.PureComponent<{}> {
    render() {
      const { children } = this.props;
      return { children };
    }
  }

  const Component = useMemo(
    () => createFluidComponent<{}, ViewStyle>(NavigationComponent, true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const states = [...(stateContext ? stateContext.states : [])];

  // Render
  return (
    <StateContext.Provider value={{ states }}>
      <Component {...props} />
    </StateContext.Provider>
  );
};
