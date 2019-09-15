export class Metrics extends Object {
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  setValues = (x: number, y: number, width: number, height: number) => {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  x: number;
  y: number;
  width: number;
  height: number;
}

export type MetricsInfo = {
  x: number;
  y: number;
  width: number;
  height: number;
};
