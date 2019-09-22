import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import * as Colors from "../colors";
import Fluid, { MetricsInfo } from "react-native-fluid-transitions";

type BoxProps = {
  active: boolean;
  onPress: () => void;
};
const Box: React.FC<BoxProps> = ({ onPress, active }) => {
  return (
    <Fluid.View
      onPress={onPress}
      animation={Fluid.Animations.Timings.Default}
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

const TimelineExampleScreen = () => {
  const [items] = useState(() => createItems());
  const [index, setIndex] = useState(-1);
  const [toggled, setToggled] = useState(false);
  const toggle = useCallback((i: number) => {
    setIndex(i);
    setToggled(p => !p);
  }, []);

  const customStaggerFunc = useCallback(
    (
      _index: number,
      metrics: MetricsInfo,
      _parentMetrics: MetricsInfo,
      children: Array<MetricsInfo>,
    ) => {
      const cx = metrics.x + metrics.width / 2;
      const cy = metrics.y + metrics.height / 2;
      const px = children[index].x + children[index].width / 2;
      const py = children[index].y + children[index].height / 2;
      const c = Math.abs(Math.hypot(cx - px, cy - py)) * 2.5;
      return c;
    },
    [index],
  );

  const config = Fluid.createConfig({
    childAnimation: {
      type: "staggered",
      staggerFunc: customStaggerFunc,
    },
  });

  return (
    <View style={styles.container}>
      <Fluid.View
        style={styles.boxContainer}
        config={config}
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

export default TimelineExampleScreen;