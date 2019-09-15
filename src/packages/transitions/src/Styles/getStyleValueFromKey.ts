import { Style } from "../Components/Types";
import { getMergedStyles } from "./getMergedStyles";

export function getStyleValueFromKey(key: string, style: Array<Style> | Style) {
  // Start be merging the styles
  const mergedStyles = style instanceof Array ? getMergedStyles(style) : style;
  // Check if we are looking for a sub-key
  if (key.includes(".")) {
    const keys = key.split(".");
    let index = 0;
    let curValue = mergedStyles[keys[index++]];
    while (index < keys.length) {
      if (curValue instanceof Array) {
        const key = keys[index++];
        curValue = curValue.find(obj => obj[key] !== undefined);
        if (curValue) curValue = curValue[key];
      } else {
        curValue = curValue[keys[index++]];
      }
    }
    return curValue;
  } else {
    return mergedStyles[key];
  }
}
