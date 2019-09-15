import { Dimensions } from "react-native";

export const generateRandomImageUri = (width?: number, height?: number) => {
  const randomNumber = Math.floor(Math.random() * 100 + 1);
  return generateImageUri(randomNumber, width, height);
};

export const generateImageUri = (
  imageId: number,
  width?: number,
  height?: number
) => {
  const size = Dimensions.get("window");
  const imageHeight = Math.round(height || size.width * 0.4);
  const imageWidth = Math.round(width || size.width);
  return `https://picsum.photos/${imageWidth}/${imageHeight}?image=${imageId}`;
};
