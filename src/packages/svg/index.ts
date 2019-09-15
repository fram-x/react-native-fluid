import Fluid from "react-native-fluid-transitions";
import Svg, { Defs, Stop } from "react-native-svg";
import {
  FluidEllipse,
  FluidCircle,
  FluidRect,
  FluidLine,
  FluidLinearGradient
} from "./src/Components";

const SvgViews = {
  Ellipse: FluidEllipse,
  Circle: FluidCircle,
  Rect: FluidRect,
  Line: FluidLine,
  LinearGradient: FluidLinearGradient,
  Defs,
  Stop,
  Svg
};

const SvgFluid = {
  ...Fluid,
  Svg: SvgViews
};

export default SvgFluid;
