import { Style, Values } from "../Components/Types";
import { getStyleKeys } from "./getStyleKeys";
import { getMergedStyles } from "./getMergedStyles";
import { getStyleValueFromKey } from "./getStyleValueFromKey";

export const getStyleInfo = (
  style: Style | Style[] | undefined
): { styleKeys: string[]; styleValues: Values } => {
  if (!style) {
    return { styleKeys: [], styleValues: [] };
  }
  const styleKeys = getStyleKeys(style);
  const mergedStyle = getMergedStyles(style);
  const styleValues: Values = {};
  styleKeys.forEach(
    key => (styleValues[key] = getStyleValueFromKey(key, mergedStyle))
  );
  return { styleKeys, styleValues };
};
