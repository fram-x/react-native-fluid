import { processColor } from "react-native";

const getColorFromStringOrNumber = (color: string | number) => {
  // 0xaarrggbb
  const l = processColor(color);
  return {
    rgba: [
      (l >> 16) & 0x0000ff,
      (l >> 8) & 0x00ff,
      l & 0xff,
      (l >> 24) & 0x000000ff
    ]
  };
};

export { getColorFromStringOrNumber };
