import React from "react";
import Fluid from "react-native-fluid-transitions";
import { Text, StyleSheet } from "react-native";

const config = Fluid.createConfig({ childAnimation: { type: "staggered" } });

const Ticker: React.FunctionComponent<{
  text: string;
  appear: any;
}> = ({ text, appear }) => {
  return (
    <Fluid.View label="textContainer" style={styles.container} config={config}>
      {text.split("").map((s: string, index: number) =>
        s === " " ? (
          <Text key={text + index.toString()}> </Text>
        ) : (
          <Fluid.Text
            label={s}
            key={text + index.toString()}
            initialStyle={appear}>
            {s}
          </Fluid.Text>
        ),
      )}
    </Fluid.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#CCC",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    padding: 20,
  },
});

export default Ticker;
