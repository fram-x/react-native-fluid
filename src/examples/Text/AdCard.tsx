import React from "react";
import Fluid from "react-native-fluid-transitions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Colors from "../colors";
import { StyleSheet, View } from "react-native";

const config = Fluid.createConfig({ childAnimation: { type: "staggered" } });

const AdCard: React.FunctionComponent<{
  icon: string;
  header: string;
  subtitle: string;
}> = ({ icon, header, subtitle }) => {
  return (
    <View style={styles.container}>
      <Fluid.View
        style={styles.innerRowContainer}
        label="adcontainer"
        config={config}
      >
        <Fluid.View
          label="adicon"
          style={styles.iconContainer}
          initialStyle={styles.unmountedFirst}
        >
          <Icon size={28} color={Colors.ColorC} name={icon} />
        </Fluid.View>
        <Fluid.View style={styles.innerColContainer}>
          <Fluid.Text
            label="adHeader"
            initialStyle={styles.unmountedLast}
            style={styles.headerText}
          >
            {header}
          </Fluid.Text>
          <Fluid.Text
            label="adText"
            initialStyle={styles.unmountedFirst}
            style={styles.subHeaderText}
          >
            {subtitle}
          </Fluid.Text>
        </Fluid.View>
      </Fluid.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#CCC",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  innerRowContainer: {
    flexDirection: "row"
  },
  innerColContainer: {},
  iconContainer: {
    marginTop: 13
  },
  headerText: {
    marginTop: 10,
    marginRight: 10,
    fontSize: 28,
    fontWeight: "bold",
    color: "#454545"
  },
  subHeaderText: {
    marginBottom: 10,
    fontSize: 12
  },
  unmountedFirst: {
    transform: [{ translateY: -70 }]
  },
  unmountedLast: {
    transform: [{ translateY: -140 }]
  },
  detachedFirst: {
    transform: [{ translateY: 70 }]
  },
  detachedLast: {
    transform: [{ translateY: 140 }]
  }
});

export default AdCard;
