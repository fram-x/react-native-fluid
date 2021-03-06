import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import AdCard from "./AdCard";
import Ticker from "./Ticker";
import Fluid from "react-native-fluid-transitions";

const config = Fluid.createConfig({
  childAnimation: { type: "staggered", stagger: 250 },
  animation: Fluid.Animations.Springs.Wobbly,
});

const TextExampleScreen = () => {
  const [counter, setCounter] = useState(0);

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
            transform: [{ translateY: -40 }],
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
