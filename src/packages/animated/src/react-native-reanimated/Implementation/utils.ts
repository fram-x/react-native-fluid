export function isAnimatedNode(value: Object): boolean {
  return value && value.hasOwnProperty("__nodeID");
}
