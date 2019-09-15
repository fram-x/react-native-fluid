import { StyleSheet } from "react-native";
import { Style } from "../Components/Types";

export const getMergedStyles = (styles: Style | Array<Style>): Style => {
  if (!(styles instanceof Array)) {
    return StyleSheet.flatten(styles);
  }

  const retVal: Style = { transform: [] };

  styles.forEach(style => {
    if (style) {
      // Flatten style if necessary
      let flattenedStyle: Style = style;
      if (isNumber(flattenedStyle)) {
        flattenedStyle = StyleSheet.flatten(flattenedStyle);
      }

      // Make sure we skip stypes equal to transform:array[0]
      if (
        !(
          flattenedStyle.transform &&
          flattenedStyle.transform.length === 0 &&
          Object.keys(flattenedStyle).length === 1
        )
      ) {
        Object.keys(flattenedStyle).forEach(key => {
          if (flattenedStyle[key] && flattenedStyle[key] instanceof Array) {
            const array = flattenedStyle[key] as Array<Style>;
            if (!retVal[key]) retVal[key] = [];
            array.forEach(i => {
              // replace
              const existingItem = retVal[key].find(
                (vk: Style) => Object.keys(vk)[0] === Object.keys(i)[0]
              );
              if (existingItem) {
                const index = retVal[key].indexOf(existingItem);
                if (index > -1) {
                  retVal[key].splice(index, 1);
                }
              }
              retVal[key].push({ ...i });
            });
          } else if (flattenedStyle[key] !== undefined) {
            retVal[key] = flattenedStyle[key];
          }
        });
      }
    }
  });
  if (retVal.transform.length === 0) {
    delete retVal.transform;
  }
  return retVal;
};

function isNumber(n: any) {
  return !Number.isNaN(parseFloat(n)) && !Number.isNaN(n - 0);
}
