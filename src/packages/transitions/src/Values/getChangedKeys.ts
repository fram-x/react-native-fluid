export const getChangedKeys = (fromKeys: string[], toKeys: string[]) => ({
  added: getAddedKeys(fromKeys, toKeys),
  removed: getRemovedKeys(fromKeys, toKeys)
});

const getAddedKeys = (fromKeys: string[], toKeys: string[]) => {
  return fromKeys.filter(k1 => toKeys.find(k2 => k1 === k2) === undefined);
};

const getRemovedKeys = (fromKeys: string[], toKeys: string[]) => {
  return toKeys.filter(k1 => fromKeys.find(k2 => k1 === k2) === undefined);
};
