import { DescriptorType } from "../Types/AnimatedValueType";

export const setValueForKey = (
  key: string,
  value: unknown,
  object: { [key: string]: any },
  valueType?: DescriptorType
): { [key: string]: any } => {
  if (key.indexOf(".") === -1) {
    object[key] = value;
  } else {
    const keys = key.split(".");
    if (valueType === "array") {
      // Check if we have an array
      if (!object[keys[0]]) {
        object[keys[0]] = [];
      }
      // Get array
      const array = object[keys[0]] as Array<{
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
      setValue(key, value, object);
    }
  }
  return object;
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
