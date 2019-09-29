import React from "react";
import { TouchableWithoutFeedback } from "react-native";

export const useTouchable = (
  onPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
) => {
  const handleOnPress = () => {
    onPress && onPress();
  };

  const handleOnPressIn = () => {
    onPressIn && onPressIn();
  };

  const handleOnPressOut = () => {
    onPressOut && onPressOut();
  };

  /*************************************************************
    Rendering
    ************************************************************/

  const isTouchable =
    onPress !== undefined ||
    onPressIn !== undefined ||
    onPressOut !== undefined;

  const renderTouchable = (
    child: React.ReactChild,
    props: any,
    touchable: boolean,
  ): React.ReactElement => {
    if (touchable) {
      let onLayout: any;
      if (React.isValidElement(child)) {
        // @ts-ignore
        onLayout = props.onLayout;
      }
      return (
        <TouchableWithoutFeedback
          onPress={handleOnPress}
          onPressIn={handleOnPressIn}
          onPressOut={handleOnPressOut}
          onLayout={onLayout}>
          {child}
        </TouchableWithoutFeedback>
      );
    }
    return child;
  };

  const render = (child: React.ReactChild, props: any): React.ReactChild =>
    renderTouchable(child, props, isTouchable);

  return {
    render,
  };
};
