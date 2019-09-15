import { StyleSheet } from "react-native";
import * as Colors from "../colors";

export const navigationStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEFEFE"
  },
  elementContainer: {
    padding: 20,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  sharedBorder: {
    height: 40,
    width: 40,
    borderRadius: 4,
    backgroundColor: Colors.ColorD,
    margin: 10
  }
});
