import { Animated } from "react-native";

export class RadNode extends Animated.Value {
  constructor(parent: Animated.Value) {
    // @ts-ignore
    super(parent.__getValue());
    this._parent = parent;
  }

  _parent: Animated.Value;

  __attach(): void {
    // @ts-ignore
    this._parent.__addChild(this);
  }

  __detach(): void {
    // @ts-ignore
    this._parent.__removeChild(this);
    // @ts-ignore
    super.__detach();
  }

  setValue = (value: number) => {
    if (Number.isNaN(value)) {
      throw new Error("Value is not a number");
    }
    this._parent.setValue(value);
  };

  __getValue = () => {
    // @ts-ignore
    return this._parent.__getValue() + "rad";
  };
}
