import React, { useState, useMemo, useCallback } from "react";
import { Text, StyleSheet, Slider } from "react-native";

import MovingButton from "./MovingButton";
import Fluid from "react-native-fluid-transitions";
import { DriverContext } from "react-native-fluid-transitions";
import { AnimationProvider } from "react-native-fluid-animations";
import { Switch } from "react-native-gesture-handler";
import { useFluidConfig } from "react-native-fluid-transitions";

const DriverExampleScreen = () => {
  const [toggled, setToggled] = useState(false);
  const [active, setActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const driver = useMemo(() => AnimationProvider.createValue(0), []);
  const handleSliderChange = useCallback(
    (value: number) => {
      driver.setValue(
        AnimationProvider.Animated.divide(
          value,
          AnimationProvider.Animated.divide(1.0, duration),
        ),
      );
    },
    [driver, duration],
  );

  const toggle = useCallback(() => setToggled(p => !p), []);

  const handleActiveChange = useCallback(() => {
    setActive(p => !p);
    if (!active) {
      driver.setValue(0);
    }
  }, [active, driver]);

  const driverContext = useMemo(
    () =>
      active
        ? {
            requestDuration: setDuration,
            driver,
          }
        : undefined,
    [driver, setDuration, active],
  );

  const config = useFluidConfig({
    childAnimation: {
      type: "staggered",
      stagger: 150,
    },
  });

  return (
    <DriverContext.Provider value={driverContext}>
      <Fluid.View style={styles.container} label="container" config={config}>
        <Text>Toggle external driver on / off</Text>
        <Switch value={active} onValueChange={handleActiveChange} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          onValueChange={handleSliderChange}
        />
        <Text style={styles.text}>Double-tap to tween</Text>
        <MovingButton onToggle={toggle} toggled={toggled} />
        <MovingButton onToggle={toggle} toggled={toggled} />
        <MovingButton onToggle={toggle} toggled={toggled} />
      </Fluid.View>
    </DriverContext.Provider>
  );
};

DriverExampleScreen.navigationOptions = {
  title: "Driver",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  slider: {
    alignSelf: "stretch",
    margin: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 11,
    marginBottom: 15,
  },
});

export default DriverExampleScreen;
