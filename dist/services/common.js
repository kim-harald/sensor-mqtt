"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rounded = exports.delay = exports.prop = exports.toCelsius = exports.toKelvin = exports.int2BoolList = exports.cKelvinOffset = void 0;
exports.cKelvinOffset = 273.15;
const int2BoolList = (num) => {
    const result = new Array();
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
//# sourceMappingURL=common.js.map