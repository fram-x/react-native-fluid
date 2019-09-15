export function bezier(mX1: number, mY1: number, mX2: number, mY2: number) {
  // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
  const cx = 3.0 * mX1;
  const bx = 3.0 * (mX2 - mX1) - cx;
  const ax = 1.0 - cx - bx;

  const cy = 3.0 * mY1;
  const by = 3.0 * (mY2 - mY1) - cy;
  const ay = 1.0 - cy - by;

  const sampleCurveX = (t: number) => {
    // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    return ((ax * t + bx) * t + cx) * t;
  };

  const sampleCurveY = (t: number) => {
    return ((ay * t + by) * t + cy) * t;
  };

  const sampleCurveDerivativeX = (t: number) => {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  };

  const solveCurveX = (x: number, epsilon: number) => {
    let t0, t1, t2, x2, d2: number;
    let i: number;

    // First try a few iterations of Newton's method -- normally very fast.
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < epsilon) return t2;
      d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }

    // Fall back to the bisection method for reliability.
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;

    if (t2 < t0) return t0;
    if (t2 > t1) return t1;

    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) return t2;
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }

    // Failure.
    return t2;
  };

  return function BezierEasing(x: number) {
    return sampleCurveY(solveCurveX(x, Number.EPSILON));
  };
}
