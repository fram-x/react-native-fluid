import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import AdCard from "./AdCard";
import Ticker from "./Ticker";
import Fluid from "react-native-fluid-transitions";
import { useFluidConfig } from "react-native-fluid-transitions";
import { Staggered } from "react-native-fluid-transitions";
import { AnimationType } from "react-native-fluid-transitions";

const TextExampleScreen = () => {
  const [counter, setCounter] = useState(0);

  const config = useFluidConfig(
    Staggered(),
    AnimationType(Fluid.Animations.Springs.Wobbly),
  );

  return (
    <View style={styles.container}>
      <Fluid.View
        label="container"
        config={config}
        onPress={() => setCounter(counter + 1)}>
        <AdCard
          key={"AdCard" + counter.toString()}
          icon="hospital"
          header="PHARMACY"
          subtitle="ONLINE DOCTOR CONSULTATIONS"
        />
        <Ticker
          key={"Ticker1" + counter.toString()}
          text={"Aloha from Hawaii"}
          appear={{
            transform: [{ translateX: 200 }],
            opacity: 0,
          }}
        />
        <Ticker
          key={"Ticker2" + counter.toString()}
          text={"Buenos Noches"}
          appear={{
            transform: [{ scale: 0.009 }],
          }}
        />
        <Ticker
          key={"Ticker3" + counter.toString()}
          text={"Hello from the US"}
          appear={{
            transform: [{ rotateY: "90deg" }],
          }}
        />
      </Fluid.View>
    </View>
  );
};

TextExampleScreen.navigationOptions = { title: "Text " };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

export default TextExampleScreen;
