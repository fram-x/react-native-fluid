import { createConfig } from "./createConfig";

export const validateConfig = (config: any) => {
  if (config instanceof Array) {
    let isValid = true;
    config.forEach(c => (isValid = isValid && validateConfig(c)));
    return isValid;
  } else {
    // Check for elements not in schema
    const props = Object.getOwnPropertyNames(config);
    const propsAsString = JSON.stringify(props.sort());
    if (validPropsAsString !== propsAsString) {
      return false;
    }

    // validate individual types
    // for (let i = 0; i < props.length; i++) {
    //   const prop = props[i];
    //   if (typeof config[prop] !== validTypes[prop]) {
    //     return false;
    //   }
    // }
  }

  return true;
};

// type TypeDescriptor = {
//   [key: string]: TypeDescriptor | string;
// };

// const getTypeDescriptor = (obj: any): TypeDescriptor => {
//   const schema: TypeDescriptor = {};
//   Object.keys(obj).forEach(key => {
//     if (typeof obj[key] === "object") {
//       schema[key] = getTypeDescriptor(obj[key]);
//     } else if (obj[key] instanceof Array) {
//       // Handle arrays
//       if (obj[key].length === 0) {
//         schema[key] = "unknown[]";
//       } else {
//         schema[key] = getTypeDescriptor(obj[key][0]) + "[]";
//       }
//     } else {
//       // Handle values
//       schema[key] = typeof obj[key];
//     }
//   });
//   return schema;
// };

const validSchema: any = createConfig({});
const validProps = Object.getOwnPropertyNames(validSchema);
const validPropsAsString = JSON.stringify(validProps.sort());
// const validTypes: { [key: string]: string } = {};
validProps.forEach(p => (validSchema[p] = typeof p));
