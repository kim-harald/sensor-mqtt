import { Reading } from "../models/reading";
export declare const cKelvinOffset = 273.15;
export declare const int2BoolList: (num: number) => Array<boolean>;
export declare const toKelvin: (celcius: number) => number;
export declare const toCelsius: (kelvin: number) => number;
export declare function prop<T, K extends keyof T>(obj: T, key: K): T[K];
export declare const delay: (ms: number) => Promise<void>;
export declare const rounded: (v: number, n: number) => number;
export declare const sortReadings: (a: Reading, b: Reading) => number;
export declare const unique: (arr: any[]) => string[];
export declare const proper: (str: string) => string;
export declare const getStandardDeviation: (array: number[]) => number;
export declare const mean: (array: number[]) => number;
export declare const normaliseReading: (reading: Reading) => Reading;
export declare const normalise: (temperature: number, pressure: number, humidity: number) => {
    temperature: number;
    pressure: number;
    humidity: number;
};
//# sourceMappingURL=common.d.ts.map