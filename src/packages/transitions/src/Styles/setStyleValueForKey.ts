import { Style } from "../Components/Types";
import { getMergedStyles } from "./getMergedStyles";

export const setStyleValueForKey = (
  key: string,
  value: unknown,
  style: Array<Style> | Style
): Style => {
  const mergedStyle = style instanceof Array ? getMergedStyles(style) : style;
  if (key.indexOf(".") === -1) {
    mergedStyle[key] = value;
  } else {
    const keys = key.split(".");
    if (keys[0] === "transform") {
      // Check if we have an array
      if (!mergedStyle["transform"]) {
        mergedStyle["transform"] = [];
      }
      // Get array
      const array = mergedStyle["transform"] as Array<{
        [key: string]: unknown;
      }>;
      // Check if we have element in array
      const index = array.findIndex(i => Object.keys(i)[0] === keys[1]);
      if (index > -1) {
        // Update
        array[index][keys[1]] = value;
      } else {
        array.push({ [keys[1]]: value });
      }
    } else {
      setValue(key, value, mergedStyle);
    }
  }
  return mergedStyle;
};

// https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
function setValue(
  path: string,
  value: unknown,
  obj: { [key: string]: unknown }
) {
  let schema: { [key: string]: unknown } = obj;
  const pList = path.split(".");
  const len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    // @ts-ignore
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
}
