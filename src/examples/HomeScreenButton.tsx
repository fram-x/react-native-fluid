import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Colors from "./colors";

interface CardProps {
  text: string;
  icon: string;
  onPress: () => void;
}

const HomeScreenButton = (props: CardProps) => {
  const { text, icon, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Icon style={styles.cardIcon} size={32} name={icon} />
      <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    width: width / 3 - 30,
    height: width / 3 - 30,
    borderColor: "#444",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    margin: 10,
  },
  cardIcon: {
    marginBottom: 10,
    color: Colors.ColorA,
  },
  cardText: {
    textAlign: "center",
  },
});

export default HomeScreenButton;
