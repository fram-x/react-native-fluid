export const copyObject = (source: Object): Object => {
  if (source instanceof Array) {
    return source.map(s => copyObject(s));
  }
  if (typeof source === "object") {
    return { ...source };
  }
  return source;
};
