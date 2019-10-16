import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { FloatingLabel } from "./FloatingLabel";
import { LikeHeart } from "./LikeHeart";
import { AnimatedNumber } from "./AnimatedNumber";
import { CallButton } from "./CallButton";
import { InteractionContainer } from "./InteractionContainer";
import { LoginButton } from "./LoginButton";
import {
  MyComponent,
  MySimpleComponent,
  MyFluidComponent,
  MyFluidStateComponent,
} from "./OldWay";

const InteractionsExampleScreen = () => {
  const randomNumber = () => Math.floor(Math.random() * 10000) + 1000;
  const [number, setNumber] = useState(randomNumber());
  const toggleNumber = () => setNumber(randomNumber());

  const [isCalling, setIsCalling] = useState(0);
  const toggleCalling = () => setIsCalling(p => p + 1);

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <InteractionContainer text={"Simple"}>
          <MySimpleComponent>
            <Text>No Animations</Text>
          </MySimpleComponent>
        </InteractionContainer>
        <InteractionContainer text={"Animated"}>
          <MyComponent>
            <Text>Animated</Text>
          </MyComponent>
        </InteractionContainer>
        <InteractionContainer text={"Fluid"}>
          <MyFluidComponent>
            <Text>Fluid!</Text>
          </MyFluidComponent>
        </InteractionContainer>
        <InteractionContainer text={"Fluid State"}>
          <MyFluidStateComponent>
            <Text>Fluid states!</Text>
          </MyFluidStateComponent>
        </InteractionContainer>
      </View>
    </View>
  );
};

InteractionsExampleScreen.navigationOptions = {
  title: "Interactions",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  controlContainer: {
    marginVertical: 14,
  },
});

export default InteractionsExampleScreen;
