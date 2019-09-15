import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { FloatingLabel } from "./FloatingLabel";
import { LikeHeart } from "./LikeHeart";
import { AnimatedNumber } from "./AnimatedNumber";
import { CallButton } from "./CallButton";
import { InteractionContainer } from "./InteractionContainer";
import { LoginButton } from "./LoginButton";

const InteractionsExampleScreen = () => {
  const randomNumber = () => Math.floor(Math.random() * 10000) + 1000;
  const [number, setNumber] = useState(randomNumber());
  const toggleNumber = () => setNumber(randomNumber());

  const [isCalling, setIsCalling] = useState(0);
  const toggleCalling = () => setIsCalling(p => p + 1);

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {/* Floating Label */}
        <InteractionContainer text={"Floating Label"}>
          <FloatingLabel placeholder={"Enter username"} />
        </InteractionContainer>
        {/* Like heart */}
        <InteractionContainer text={"Likes (tap to like)"}>
          <LikeHeart />
        </InteractionContainer>
        {/* Animated number */}
        <InteractionContainer
          text={"Animated number\n(tap to change)"}
          onPress={toggleNumber}
        >
          <AnimatedNumber value={number} />
        </InteractionContainer>
        {/* Calling */}
        <InteractionContainer text={"Call animation"} onPress={toggleCalling}>
          <CallButton isCalling={isCalling} />
        </InteractionContainer>
        {/* Login */}
        <InteractionContainer text={"Login button"}>
          <LoginButton />
        </InteractionContainer>
      </View>
    </View>
  );
};

InteractionsExampleScreen.navigationOptions = {
  title: "Interactions"
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  controlContainer: {
    marginVertical: 14
  }
});

export default InteractionsExampleScreen;
