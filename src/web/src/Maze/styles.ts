import { StyleSheet } from "react-native";
import { ColorC } from "../colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorC,
    overflow: "hidden"
  },
  line: {
    width: 2,
    backgroundColor: "#000"
  },
  setBox: {
    transform: [{ rotate: "-45deg" }]
  },
  offsetBox: {
    transform: [{ rotate: "45deg" }]
  }
});
