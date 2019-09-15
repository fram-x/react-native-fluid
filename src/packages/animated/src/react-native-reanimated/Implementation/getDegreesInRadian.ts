export const getDegreesInRadian = (rotation: string): number => {
  if (!rotation) return 0;
  if (rotation.endsWith("deg")) {
    return degToRad(parseFloat(rotation.substring(0, rotation.length - 3)));
  } else if (rotation.endsWith("rad")) {
    return parseFloat(rotation.substring(0, rotation.length - 3));
  }
  return 0;
};

const degToRad = (deg: number): number => (deg * Math.PI) / 180;
