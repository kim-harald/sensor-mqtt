import { rotate } from '../common/common';

const k_samples = 10 * 10; // 10 samples per minute * 10 minutes

export class TrendService {
  private static data: Record<string, number[]> = {
    temperature: [0],
    pressure: [0],
    humidity: [0],
  };

  public static add(value: number, type: string): number {
    const values = rotate(this.data[type], value, k_samples);
    return computeTrend(values);
  }

  public static get trend(): Record<string, number> {
    const result: Record<string, number> = {};
    const types = Object.keys(this.data);
    types.forEach((t) => {
      result[t] = computeTrend(this.data[t]);
    });

    return result;
  }
}

const computeTrend = (values: number[]): number => {
  const points = values.map((m: number, index: number) => {
    return { x: m, y: index };
  });
  const trendValues = trendline(points);
  return trendValues.a;
};

const trendline = (
  points: { x: number; y: number }[]
): { a: number; b: number } => {
  const n = points.length;
  let sigmaXY = 0;
  let sigmaX = 0;
  let sigmaY = 0;
  let sigmaX2 = 0;
  for (let point of points) {
    sigmaXY += point.x * point.y;
    sigmaX2 += point.x * point.x;
    sigmaX += point.x;
    sigmaY += point.y;
  }

  if (sigmaX2 - sigmaX * sigmaX !== 0) {
    const alpha =
      (n * sigmaXY - sigmaX * sigmaY) / (n * sigmaX2 - sigmaX * sigmaX);
    const beta = (sigmaY - alpha * sigmaX) / n;

    return { a: beta, b: alpha };
  }

  return { a: 0, b: 0 };
};
