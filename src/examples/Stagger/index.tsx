import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import * as Colors from "../colors";
import Fluid, { MetricsInfo, Staggered } from "react-native-fluid-transitions";

type BoxProps = {
  active: boolean;
  onPress: () => void;
};
const Box: React.FC<BoxProps> = ({ onPress, active }) => {
  return (
    <Fluid.View
      onPress={onPress}
      animation={Fluid.Animations.Timings.Long}
      staticStyle={styles.box}
      style={active ? styles.activeBox : styles.inactiveBox}
    />
  );
};

const columns = 12;
const boxSize = 20;
const createItems = () => {
  const nextMaze: boolean[] = [];
  for (let i = 0; i < columns * columns; i++) {
    nextMaze.push(true);
  }
  return nextMaze;
};

const StaggerExampleScreen = () => {
  const [items] = useState(() => createItems());
  const [index, setIndex] = useState(-1);
  const [toggled, setToggled] = useState(false);
  const toggle = useCallback((i: number) => {
    setIndex(i);
    setToggled(p => !p);
  }, []);

  const customStaggerFunc = useCallback(
    (_: MetricsInfo, childMetrics: Array<MetricsInfo>) => {
      let maxValue = 0;
      let retVal: number[] = new Array(childMetrics.length);
      const px = childMetrics[index].x + childMetrics[index].width / 2;
      const py = childMetrics[index].y + childMetrics[index].height / 2;
      childMetrics.forEach((m, i) => {
        const cx = m.x + m.width / 2;
        const cy = m.y + m.height / 2;
        const c = Math.abs(Math.hypot(cx - px, cy - py)) * 2.5;
        maxValue = Math.max(maxValue, c);
        retVal[i] = c;
      });

      const easing = (t: number) => t * t;
      return retVal.map(val => easing(val / maxValue) * maxValue);
    },
    [index],
  );

  return (
    <View style={styles.container}>
      <Fluid.View
        style={styles.boxContainer}
        config={Staggered(customStaggerFunc)}
        onPress={() => toggle(0)}>
        {items.map((_, i) => (
          <Box key={i} active={toggled} onPress={() => toggle(i)} />
        ))}
      </Fluid.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boxContainer: {
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    borderColor: "#000",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  box: {
    width: boxSize,
    height: boxSize,
    backgroundColor: Colors.ColorA,
    margin: 2,
  },
  inactiveBox: {
    transform: [{ scale: 1 }],
  },
  activeBox: {
    transform: [{ scale: 0.0009 }],
  },
});

export default StaggerExampleScreen;
