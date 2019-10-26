import React from "react";
import { StyleSheet, Dimensions, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/core";
import Fluid from "react-native-fluid-transitions";
import {
  useTopTransition,
  useHorizontalTransition,
} from "react-native-fluid-navigation";
import { Bubble } from "./bubble";
import { ColorA, ColorB, ColorC, ColorE } from "../colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

type Props = {
  name: string;
  color: string;
  next?: string;
  prev?: string;
};

export const Screen: React.FC<Props> = ({ name, color, next, prev }) => {
  const navigation = useNavigation();

  const buttonTransitions = useHorizontalTransition(screenWidth);
  const headerTransitions = useTopTransition(screenHeight);

  return (
    <Fluid.View
      label={name}
      style={{ ...styles.container, backgroundColor: color }}
      // config={config}
    >
      <Fluid.View config={headerTransitions} style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
        <Text style={styles.headerSubText}>
          {"Hello world from " + name + "!"}
        </Text>
      </Fluid.View>
      <Fluid.View
        style={styles.content}
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
      <Fluid.View
        label={"buttons_" + name}
        config={buttonTransitions}
        style={styles.footer}>
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
    marginVertical: 80,
    marginHorizontal: 20,
    paddingVertical: 20,
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 14,
  },
});
