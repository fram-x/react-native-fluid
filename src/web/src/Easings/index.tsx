import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import Fluid, { Easings } from "react-native-fluid-transitions";

import * as Colors from "../colors";

type Props = {
  easing?: any;
  isActive: boolean;
  color: string;
};
const EC: React.FC<Props> = ({ easing, isActive, color }) => (
  <View style={styles.componentContainer}>
    <Text style={styles.text}>{easing ? easing.name : "spring"}</Text>
    <Fluid.View
      staticStyle={[styles.component, { backgroundColor: color }]}
      style={isActive ? styles.activeComponent : styles.inactiveComponent}
      animation={
        easing !== undefined
          ? {
              type: "timing",
              duration: 2000,
              easing,
            }
          : {
              type: "spring",
              mass: 2,
              stiffness: 120,
              damping: 10,
            }
      }
    />
  </View>
);

const EasingExampleScreen = () => {
  const [isActive, setIsActive] = useState(false);
  const toggle = () => setIsActive(p => !p);

  return (
    <Fluid.View style={styles.container} label="container">
      <View style={styles.componentsContainer}>
        <EC easing={Easings.linear} color={Colors.ColorA} isActive={isActive} />
        <EC easing={Easings.ease} color={Colors.ColorB} isActive={isActive} />
        <EC easing={Easings.back()} color={Colors.ColorC} isActive={isActive} />
        <EC easing={Easings.bounce} color={Colors.ColorD} isActive={isActive} />
        <EC easing={Easings.circle} color={Colors.ColorE} isActive={isActive} />
        <EC easing={Easings.cubic} color={Colors.ColorA} isActive={isActive} />
        <EC
          easing={Easings.elastic()}
          color={Colors.ColorB}
          isActive={isActive}
        />
        <EC easing={Easings.exp} color={Colors.ColorC} isActive={isActive} />
        <EC easing={Easings.poly()} color={Colors.ColorD} isActive={isActive} />
        <EC easing={Easings.quad} color={Colors.ColorE} isActive={isActive} />
        <EC easing={Easings.sin} color={Colors.ColorA} isActive={isActive} />
        <EC isActive={isActive} color={Colors.ColorB} />
        <EC
          easing={Easings.combine(Easings.back(), Easings.bounce)}
          color={Colors.ColorC}
          isActive={isActive}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={toggle}>
          <Text>-></Text>
        </TouchableOpacity>
      </View>
    </Fluid.View>
  );
};

EasingExampleScreen.navigationOptions = {
  title: "Easings",
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  componentsContainer: {
    margin: 20,
  },
  componentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 11,
    marginRight: 10,
    width: 40,
  },
  component: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginVertical: 4,
  },
  inactiveComponent: {
    transform: [{ translateX: 0 }],
  },
  activeComponent: {
    transform: [{ translateX: width - 120 }],
  },
});

export default EasingExampleScreen;
