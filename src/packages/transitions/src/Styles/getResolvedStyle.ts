import { Style } from "../Components/Types/StyleTypes";

export const getResolvedStyle = (
  style: Style | Array<Style> | undefined
): Array<Style> => (style ? (style instanceof Array ? style : [style]) : []);
