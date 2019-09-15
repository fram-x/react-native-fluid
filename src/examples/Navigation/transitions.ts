import { Dimensions, StyleSheet } from "react-native";

export const transitions = StyleSheet.create({
  active: {
    transform: [{ translateX: 0 }]
  },
  inactiveIn: {
    transform: [
      { translateX: -Dimensions.get("window").width * 1.3 },
      { rotate: "-7deg" },
      { scale: 0.8 }
    ]
  },
  inactiveOut: {
    transform: [
      { translateX: Dimensions.get("window").width * 1.3 },
      { rotate: "7deg" },
      { scale: 0.8 }
    ]
  }
});
