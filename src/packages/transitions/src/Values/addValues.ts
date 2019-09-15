import { ValueTypeEntries, Values } from "../Components/Types";
import { createValue } from "./createValue";
import { ValueDescriptorType } from "../Types/AnimatedValueType";

export const addValues = (
  key: string,
  nextValues: Values,
  values: ValueTypeEntries,
  valueDescriptor: ValueDescriptorType
) => {
  // Check if we already have a value in our cache
  if (values[key]) {
    // Just mark as active again
    values[key].isSet = true;
  } else {
    // Set value
    values[key] = createValue(nextValues[key], valueDescriptor);
  }
};
