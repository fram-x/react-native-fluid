import React from "react";
import { StyleSheet } from "react-native";
import Fluid from "react-native-fluid-transitions";
import * as Colors from "../colors";

const PagerItem: React.FunctionComponent<{
  active: boolean;
  label: string;
}> = ({ active, label }) => {
  const style = [styles.item, active ? styles.itemActive : styles.itemInactive];
  return <Fluid.View label={label} style={style} />;
};

const Pager: React.FunctionComponent<{
  activeIndex: number;
  count: number;
}> = ({ activeIndex, count }) => {
  const items = Array.from({ length: count }, (_, k) => k);
  return (
    <Fluid.View style={styles.container} label={"pager"}>
      {items.map(i => (
        <PagerItem
          key={i.toString()}
          label={"pager_" + i.toString()}
          active={activeIndex === i}
        />
      ))}
    </Fluid.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24
  },
  item: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 10
  },
  itemActive: {
    backgroundColor: Colors.ColorA,
    width: 30
  },
  itemInactive: {
    backgroundColor: "#CCC",
    width: 10
  }
});

export { Pager, PagerItem };
