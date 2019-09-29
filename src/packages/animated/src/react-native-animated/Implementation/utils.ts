export function isAnimatedNode(value: Object): boolean {
  // @ts-ignore
  return value && value.__getValue !== undefined;
}
