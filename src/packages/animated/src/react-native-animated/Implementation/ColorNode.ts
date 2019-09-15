import { Animated } from "react-native";

export class ColorNode extends Animated.Value {
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
    const l = this._parent.__getValue();
    // const r = (l >> 24) & 0xff;
    // const g = (l >> 16) & 0xff;
    // const b = (l >> 8) & 0xff;
    // const a = l & 0xff;
    const clr = `rgba(${(l >> 24) & 0xff},${(l >> 16) & 0xff},${(l >> 8) &
      0xff},${l & 0xff})`;
    return clr;
  };
}
