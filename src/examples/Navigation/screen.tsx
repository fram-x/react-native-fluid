import React from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  Button,
  View,
  ScrollView,
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import Fluid from "react-native-fluid-transitions";
import {
  useTopTransition,
  useHorizontalTransition,
} from "react-native-fluid-navigation";
import { Bubble } from "./bubble";
import { ColorA, ColorB, ColorC, ColorE, ColorD } from "../colors";
import { Box } from "./box";
import { useNavigationDirection } from "react-native-fluid-navigation";
import { AnimatedButton } from "./button";
import { useNavigationStates } from "react-native-fluid-navigation";
import { useMergedConfigs, OnEnterState } from "react-native-fluid-transitions";
import { Staggered } from "react-native-fluid-transitions";

const { width: screenWidth } = Dimensions.get("screen");

type Mode = "bubbles" | "boxes" | "list";

type Props = {
  name: string;
  color: string;
  interpolationColor: string;
  interpolatorPosition: "flex-start" | "flex-end";
  next?: string;
  prev?: string;
  mode?: Mode;
};

export const Screen: React.FC<Props> = ({
  name,
  color,
  interpolationColor,
  interpolatorPosition,
  next,
  prev,
  mode = "bubbles",
}) => {
  const navigation = useNavigation();
  const direction = useNavigationDirection();
  const { forwardFrom, forwardTo, backFrom, backTo } = useNavigationStates();

  const buttonTransitions = useHorizontalTransition(screenWidth);
  const headerTransitions = useTopTransition(120);

  const sharedTransition = useMergedConfigs(
    OnEnterState(forwardTo, "Shared_" + next || ""),
    OnEnterState(backTo, "Shared_" + prev || ""),
  );

  return (
    <Fluid.View
      label={name}
      staticStyle={{ ...styles.container, backgroundColor: color }}
      config={{
        childAnimation: {
          type: "staggered",
          stagger: 100,
          direction,
        },
      }}>
      <Fluid.View config={headerTransitions} staticStyle={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
        <Text style={styles.headerSubText}>
          {"Hello world from " + name + "!"}
        </Text>
      </Fluid.View>
      {mode === "bubbles" && (
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
      {mode === "boxes" && (
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
      {mode === "list" && (
        <Fluid.View
          label="listContainer"
          staticStyle={styles.horizontalContent}
          config={Staggered(100, direction, 330)}>
          <ScrollView style={styles.listContainer}>
            {[...Array(50).keys()].map(p => (
              <Fluid.View
                key={p}
                style={styles.listItem}
                config={buttonTransitions}>
                <Text>{p}</Text>
              </Fluid.View>
            ))}
          </ScrollView>
        </Fluid.View>
      )}
      {/* <View style={styles.interpolationContainer}>
        <Fluid.View
          staticStyle={styles.interpolationBox}
          style={{
            backgroundColor: interpolationColor,
            alignSelf: interpolatorPosition,
          }}
          label={"Shared_" + name}
          config={sharedTransition}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <AnimatedButton>
          <Text>{name}</Text>
        </AnimatedButton>
      </View>
      <View style={styles.footer}>
        <Fluid.View
          staticStyle={styles.footerInner}
          label={"buttons_" + name}
          config={buttonTransitions}>
          {prev && (
            <Button title={"Back"} onPress={() => navigation.navigate(prev)} />
          )}
          {next && (
            <Button title={"Next"} onPress={() => navigation.navigate(next)} />
          )}
        </Fluid.View>
      </View>
    </Fluid.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginVertical: 20,
    // marginHorizontal: 20,
    // paddingVertical: 0,
    // marginBottom: 40,
    paddingBottom: 0,
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
  interpolationContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  interpolationBox: {
    width: 40,
    height: 40,
  },
  listContainer: {
    margin: 20,
    height: 250,
    padding: 8,
    borderColor: "#CCC",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    backgroundColor: "beige",
  },
  listItem: {
    backgroundColor: "aqua",
    margin: 4,
    padding: 14,
    borderRadius: 8,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  footer: {
    padding: 14,
    paddingBottom: 34,
    backgroundColor: "beige",
  },
  footerInner: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
