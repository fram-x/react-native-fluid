import { Style } from "../Components/Types/StyleTypes";

export const getStyleKeys = (
  styles: Style | Array<Style>,
  path?: string
): Array<string> => {
  const retVal = new Array<string>();
  let resolvedStyles = styles instanceof Array ? styles : [styles];
  resolvedStyles.forEach(style => {
    Object.keys(style).forEach(key => {
      if (style[key] && style[key] instanceof Array) {
        const childKeys = getStyleKeys(style[key], key);
        childKeys.forEach(k => retVal.push(k));
      } else {
        retVal.push(path ? path + "." + key : key);
      }
    });
  });
  return retVal;
};
