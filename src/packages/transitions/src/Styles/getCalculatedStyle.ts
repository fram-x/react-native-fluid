import { ValueTypeEntries } from "../Components/Types";
import { setStyleValueForKey } from "./setStyleValueForKey";

export const getCalulatedStyles = (styleValues: ValueTypeEntries) => {
  // Calcluate style
  const nextCalculatedStyle = {};
  Object.keys(styleValues)
    .filter(k => styleValues[k].isSet)
    .forEach(k =>
      setStyleValueForKey(k, styleValues[k].display, nextCalculatedStyle)
    );
  return nextCalculatedStyle;
};
