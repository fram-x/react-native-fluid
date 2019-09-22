import React from "react";
import { View, StyleSheet } from "react-native";
import Fluid from "react-native-fluid-transitions";
import * as Colors from "../colors";

const ProgressItem: React.FunctionComponent<{
  active: boolean;
  selected: boolean;
  label: string;
}> = ({ selected, active, label }) => {
  return (
    <Fluid.View
      label={label + "_container"}
      style={[styles.item, selected ? styles.itemActive : styles.itemInactive]}
      animation={Fluid.Animations.Springs.Wobbly}
    >
      <Fluid.View
        label={label + "_ring"}
        style={[
          styles.itemTextContainer,
          active ? styles.itemTextContainterActive : {}
        ]}
      >
        <Fluid.Text
          label={label + "_text"}
          style={[styles.itemTextInactive, active ? styles.itemTextActive : {}]}
        >
          {label}
        </Fluid.Text>
      </Fluid.View>
    </Fluid.View>
  );
};

const ProgressBar: React.FunctionComponent<{ activeIndex: number }> = ({
  activeIndex,
  children
}) => (
  <Fluid.View style={styles.container} label={"progressBar"}>
    <View style={styles.lineContainer}>
      <Fluid.View
        style={[styles.line, { flex: activeIndex }]}
        label={"progressBar_fill"}
      />
      <Fluid.View
        label={"progressBar_empty"}
        style={[
          styles.lineInactive,
          {
            flex: React.Children.toArray(children).length - 1 - activeIndex
          }
        ]}
      />
    </View>
    {children}
  </Fluid.View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 40,
    height: 60,
    width: 250
  },
  lineContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    margin: 25,
    flexDirection: "row"
  },
  line: {
    height: 3,
    backgroundColor: Colors.ColorA
  },
  lineInactive: {
    height: 3,
    backgroundColor: "#CCC"
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  itemActive: {
    transform: [{ scale: 1.0 }]
  },
  itemInactive: {
    transform: [{ scale: 0.6 }]
  },
  itemTextContainer: {
    borderWidth: 4,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#CCC",
    backgroundColor: "#FFF"
  },
  itemTextContainterActive: {
    borderColor: Colors.ColorA
  },
  itemTextInactive: {
    textAlign: "center",
    color: "#CCC",
    fontSize: 22,
    fontWeight: "bold"
  },
  itemTextActive: {
    color: Colors.ColorA
  }
});

export { ProgressBar, ProgressItem };
