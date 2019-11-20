import { AnimationProvider } from "react-native-fluid-animations";
import { createProc } from "../../Functions/createProc";

const { proc, js } = AnimationProvider.Animated;

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
      js(
        `function(
        inputValue, 
        inputMin, 
        inputMax, 
        outputMin, 
        outputMax) {
          
          const getA = function(v) {return (v & 0xff000000) >>> 24};
          const getR = function(v) {return (v & 0x00ff0000) >>> 16};
          const getG = function(v) {return (v & 0x0000ff00) >>> 8};
          const getB = function(v) {return (v & 0x000000ff)};

          const ip = function(iv, imin, imax, omin, omax) { 
              return Math.round(omin + ((iv - imin) / (imax - imin)) * (omax - omin));          
          }          
          
          const ipR = ip(inputValue, inputMin, inputMax, getA(outputMin), getR(outputMax));
          const ipG = ip(inputValue, inputMin, inputMax, getB(outputMin), getB(outputMax));
          const ipB = ip(inputValue, inputMin, inputMax, getB(outputMin), getB(outputMax));
          const ipA = ip(inputValue, inputMin, inputMax, getA(outputMin), getA(outputMax));

          const retVal = (ipA * (1 << 24)) + (ipR * (1 << 16)) + 
            (ipG * (1 << 8)) + ipB;
            
          // console.log(
          //   "#" + retVal.toString(16) + " " + 
          //   "#" + outputMin.toString(16)+ " " + 
          //   "#" + outputMax.toString(16)+ " " +                
          //   "R:0x" + ipR.toString(16)+ " " + 
          //   "G:0x" + ipG.toString(16)+ " " + 
          //   "B:0x" + ipB.toString(16)+ " " + 
          //   "A:0x" + ipA.toString(16));
        
          return retVal;
        }
      `,
        inputValue,
        inputMin,
        inputMax,
        outputMin,
        outputMax,
      ),
    // add(
    //   // Alpha
    //   multiply(
    //     interpolateInternal(
    //       inputValue,
    //       inputMin,
    //       inputMax,
    //       getAlpha(outputMin),
    //       getAlpha(outputMax)
    //     ),
    //     1 << 24
    //   ),
    //   // Red
    //   multiply(
    //     interpolateInternal(
    //       inputValue,
    //       inputMin,
    //       inputMax,
    //       getRed(outputMin),
    //       getRed(outputMax)
    //     ),
    //     1 << 16
    //   ),
    //   // Green
    //   multiply(
    //     interpolateInternal(
    //       inputValue,
    //       inputMin,
    //       inputMax,
    //       getGreen(outputMin),
    //       getGreen(outputMax)
    //     ),
    //     1 << 8
    //   ),
    //   // Blue
    //   interpolateInternal(
    //     inputValue,
    //     inputMin,
    //     inputMax,
    //     getBlue(outputMin),
    //     getBlue(outputMax)
    //   )
    // )
  );
});
