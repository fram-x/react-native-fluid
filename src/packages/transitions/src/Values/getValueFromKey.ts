export function getValueFromKey(key: string, object: { [key: string]: any }) {
  // Check if we are looking for a sub-key
  if (key.includes(".")) {
    const keys = key.split(".");
    let index = 0;
    let curValue = object[keys[index++]];
    while (index < keys.length) {
      if (curValue instanceof Array) {
        const key = keys[index++];
        curValue = curValue.find(obj => obj[key] !== undefined);
        if (curValue) curValue = curValue[key];
      } else {
        curValue = curValue[keys[index++]];
      }
    }
    return curValue;
  } else {
    return object[key];
  }
}
