import React from "react";
import { Sections, Section } from "./components";

const mariner = "#3B5F8F";
const mediumPurple = "#8266D4";
const tomato = "#F95B57";
const mySin = "#F3A646";

const sections: Section[] = [
  {
    title: "SUNGLASSES",
    leftColor: mediumPurple,
    rightColor: mariner,
    image: require("./assets/sunnies.png"),
  },
  {
    title: "FURNITURE",
    leftColor: tomato,
    rightColor: mediumPurple,
    image: require("./assets/table.png"),
  },
  {
    title: "JEWELRY",
    leftColor: mySin,
    rightColor: tomato,
    image: require("./assets/earrings.png"),
  },
  {
    title: "HEADWEAR",
    leftColor: "white",
    rightColor: tomato,
    image: require("./assets/hat.png"),
  },
];

export default () => {
  return <Sections {...{ sections }} />;
};
