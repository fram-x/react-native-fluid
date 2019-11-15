import { AnimationProvider } from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";

const {
  round,
  proc,
  add,
  multiply,
  divide,
  sub,
  cond,
  lessThan,
} = AnimationProvider.Animated;

const floor = createProc("floor", () =>
  proc("floor", a => cond(lessThan(a, round(a)), round(sub(a, 0.5)), round(a))),
);

const getAlpha = createProc("getAlpha", () =>
  proc("getAlpha", color => floor(divide(color, 0x01000000))),
);

const getRed = createProc("getRed", () =>
  proc("getRed", color =>
    floor(sub(divide(color, 0x010000), multiply(getAlpha(color), 0x0100))),
  ),
);

const getGreen = createProc("getGreen", () =>
  proc("getGreen", color =>
    floor(
      sub(
        divide(color, 0x0100),
        add(
          multiply(getAlpha(color), 0x010000),
          multiply(getRed(color), 0x0100),
        ),
      ),
    ),
  ),
);

const getBlue = createProc("getBlue", () =>
  proc("getBlue", color =>
    floor(
      sub(
        color,
        add(
          multiply(getAlpha(color), 0x01000000),
          multiply(getRed(color), 0x010000),
          multiply(getGreen(color), 0x0100),
        ),
      ),
    ),
  ),
);

const interpolateInternal = createProc("interpolateInternal", () =>
  proc(
    "interpolateInternal",
    (inputValue, inputMin, inputMax, outputMin, outputMax) =>
      floor(
        round(
          add(
            outputMin,
            multiply(
              divide(sub(inputValue, inputMin), sub(inputMax, inputMin)),
              sub(outputMax, outputMin),
            ),
          ),
        ),
      ),
  ),
);

// Input value is comming from react native processColor which is in 0xaarrggbb
export const interpolateColor = createProc("interpolateColor", () => {
  /**
   * inputValue - 0..1, normalized duration
   * inputMin - 0..1
   * inputMax - 0..1
   * outputMin - start color
   * outputMax - end color
   */
  return proc(
    "interpolateColor",
    (inputValue, inputMin, inputMax, outputMin, outputMax) =>
      add(
        // Alpha
        multiply(
          interpolateInternal(
            inputValue,
            inputMin,
            inputMax,
            getAlpha(outputMin),
            getAlpha(outputMax),
          ),
          // eslint-disable-next-line no-bitwise
          1 << 24,
        ),
        // Red
        multiply(
          interpolateInternal(
            inputValue,
            inputMin,
            inputMax,
            getRed(outputMin),
            getRed(outputMax),
          ),
          // eslint-disable-next-line no-bitwise
          1 << 16,
        ),
        // Green
        multiply(
          interpolateInternal(
            inputValue,
            inputMin,
            inputMax,
            getGreen(outputMin),
            getGreen(outputMax),
          ),
          // eslint-disable-next-line no-bitwise
          1 << 8,
        ),
        // Blue
        interpolateInternal(
          inputValue,
          inputMin,
          inputMax,
          getBlue(outputMin),
          getBlue(outputMax),
        ),
      ),
  );
});

Object.defineProperty(interpolateColor, "interpolationKey", {
  writable: false,
  value: "color",
});
