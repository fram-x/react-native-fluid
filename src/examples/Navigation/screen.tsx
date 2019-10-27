import React from "react";
import { StyleSheet, Dimensions, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/core";
import Fluid from "react-native-fluid-transitions";
import {
  useTopTransition,
  useHorizontalTransition,
} from "react-native-fluid-navigation";
import { Bubble } from "./bubble";
import { ColorA, ColorB, ColorC, ColorE, ColorD } from "../colors";
import { Box } from "./box";
import { useNavigationDirection } from "react-native-fluid-navigation";

const { width: screenWidth } = Dimensions.get("screen");

type Props = {
  name: string;
  color: string;
  next?: string;
  prev?: string;
  showBubbles?: boolean;
};

export const Screen: React.FC<Props> = ({
  name,
  color,
  next,
  prev,
  showBubbles = true,
}) => {
  const navigation = useNavigation();
  const direction = useNavigationDirection();

  const buttonTransitions = useHorizontalTransition(screenWidth);
  const headerTransitions = useTopTransition(120);

  return (
    <Fluid.View
      label={name}
      staticStyle={{ ...styles.container, backgroundColor: color }}
      // config={config}
    >
      <Fluid.View config={headerTransitions} staticStyle={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
        <Text style={styles.headerSubText}>
          {"Hello world from " + name + "!"}
        </Text>
      </Fluid.View>
      {showBubbles && (
        <Fluid.View
          label={"content-" + name}
          staticStyle={styles.verticalContent}
          config={{
            childAnimation: {
              type: "staggered",
              stagger: 100,
            },
          }}>
          <Bubble color={ColorA} />
          <Bubble color={ColorB} />
          <Bubble color={ColorC} />
          <Bubble color={ColorE} />
        </Fluid.View>
      )}
      {!showBubbles && (
        <Fluid.View
          staticStyle={styles.horizontalContent}
          config={{
            childAnimation: {
              type: "staggered",
              stagger: 100,
              direction,
            },
          }}>
          <Box color={ColorD} />
          <Box color={ColorE} />
          <Box color={ColorC} />
          <Box color={ColorB} />
        </Fluid.View>
      )}
      <Fluid.View
        label={"buttons_" + name}
        config={buttonTransitions}
        staticStyle={styles.footer}>
        {prev && (
          <Button title={"Back"} onPress={() => navigation.navigate(prev)} />
        )}
        {next && (
          <Button title={"Next"} onPress={() => navigation.navigate(next)} />
        )}
      </Fluid.View>
    </Fluid.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 0,
    paddingBottom: 0,
    marginBottom: 40,
    overflow: "hidden",
  },
  header: {
    padding: 14,
  },
  headerText: {
    fontSize: 48,
  },
  headerSubText: {
    color: "#4c4c4c",
  },
  verticalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 14,
    backgroundColor: "beige",
  },
});
