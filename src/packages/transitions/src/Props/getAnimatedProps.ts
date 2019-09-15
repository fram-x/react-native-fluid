import { ValueTypeEntries } from "../Components/Types";
import { IAnimationNode } from "react-native-fluid-animations";

export const getAnimatedProps = (propValues: ValueTypeEntries) => {
  // props
  const props: { [key: string]: IAnimationNode } = {};
  Object.keys(propValues)
    .filter(k => propValues[k].isSet)
    .forEach(k => (props[k] = propValues[k].display));
  return props;
};
