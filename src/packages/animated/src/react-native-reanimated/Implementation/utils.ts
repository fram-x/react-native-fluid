export function isAnimatedNode(value: Object): boolean {
  return value && Object.keys(value).find(k => k.startsWith("_")) !== undefined;
}
