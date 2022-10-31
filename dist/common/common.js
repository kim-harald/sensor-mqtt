"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalise = exports.normaliseReading = exports.mean = exports.getStandardDeviation = exports.proper = exports.unique = exports.sortReadings = exports.rounded = exports.delay = exports.prop = exports.toCelsius = exports.toKelvin = exports.int2BoolList = exports.cKelvinOffset = void 0;
exports.cKelvinOffset = 273.15;
const int2BoolList = (num) => {
    let result = new Array();
    for (let n = 0; n < 8; n++) {
        result.push(Boolean(num & (1 << n)));
    }
    return result;
};
exports.int2BoolList = int2BoolList;
const toKelvin = (celcius) => {
    return celcius + exports.cKelvinOffset;
};
exports.toKelvin = toKelvin;
const toCelsius = (kelvin) => {
    return kelvin - exports.cKelvinOffset;
};
exports.toCelsius = toCelsius;
function prop(obj, key) {
    return obj[key];
}
exports.prop = prop;
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.delay = delay;
const rounded = (v, n) => {
    const factorOfTen = Math.pow(10, n);
    return Math.round(v * factorOfTen) / factorOfTen;
};
exports.rounded = rounded;
const sortReadings = (a, b) => {
    var _a;
    return (_a = (a === null || a === void 0 ? void 0 : a.ts) - (b === null || b === void 0 ? void 0 : b.ts)) !== null && _a !== void 0 ? _a : 0;
};
exports.sortReadings = sortReadings;
const unique = (arr) => {
    const result = arr.filter((item, i, arr) => arr.findIndex(t => t === item) === i);
    return result;
};
exports.unique = unique;
const proper = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
exports.proper = proper;
const getStandardDeviation = (array) => {
    const n = array.length;
    const m = exports.mean(array);
    return Math.sqrt(array.map(x => Math.pow(x - m, 2)).reduce((a, b) => a + b) / n);
};
exports.getStandardDeviation = getStandardDeviation;
const mean = (array) => {
    return array.reduce((a, b) => a + b) / array.length;
};
exports.mean = mean;
const normaliseReading = (reading) => {
    var _a, _b, _c;
    const r1 = exports.normalise((_a = reading.temperature) !== null && _a !== void 0 ? _a : 0, (_b = reading.pressure) !== null && _b !== void 0 ? _b : 0, (_c = reading.humidity) !== null && _c !== void 0 ? _c : 0);
    return Object.assign(Object.assign({}, reading), { temperature: r1.temperature, pressure: r1.pressure, humidity: r1.humidity });
};
exports.normaliseReading = normaliseReading;
const normalise = (temperature, pressure, humidity) => {
    return {
        temperature: temperature - exports.cKelvinOffset,
        pressure: pressure / 100,
        humidity: humidity
    };
};
exports.normalise = normalise;
//# sourceMappingURL=common.js.map