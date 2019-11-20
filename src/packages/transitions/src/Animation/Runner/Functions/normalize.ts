import { createProc } from "../../Functions/createProc";
import { AnimationProvider } from "react-native-fluid-animations";

const { proc, js, greaterThan, divide, sub, cond } = AnimationProvider.Animated;

export const normalize = createProc("normalize", () =>
  proc(
    "normalize",
    (source, offset, duration) =>
      js(
        `function(source, offset, duration){
          if((source-offset)/duration > 1.0) {
            return 1.0;
          }
          return (source-offset)/duration;
        }`,
        source,
        offset,
        duration,
      ),

    // cond(
    //   greaterThan(divide(sub(source, offset), duration), 1.0),
    //   // Greater than 1.0 - return 1.0
    //   1.0,
    //   // Return value
    //   divide(sub(source, offset), duration)
    // )
  ),
);
