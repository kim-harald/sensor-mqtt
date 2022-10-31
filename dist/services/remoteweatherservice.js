"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteWeather = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const axiosobservable_1 = require("../axios/axiosobservable");
const SAMPLE_INTERVAL_DEFAULT = 600000;
const NOTE = 'Open weather map, Ranheim';
class RemoteWeather {
    constructor(options) {
        var _a;
        this._url = 'https://api.openweathermap.org/data/2.5/weather?q=Ranheim&appid=c8bc47495f2a596286dd0f523e1921aa';
        this._sampleInterval = 10 * 60 * 1000;
        const i2cOptions = (_a = options === null || options === void 0 ? void 0 : options.I2C) !== null && _a !== void 0 ? _a : {
            address: 0,
            busNumber: 1,
            sampleInterval: SAMPLE_INTERVAL_DEFAULT
        };
        this._sampleInterval = i2cOptions.sampleInterval;
    }
    open(options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return rxjs_1.from(this.httpRead());
        });
    }
    httpRead() {
        const result$ = axiosobservable_1.Axios.get(this._url).pipe(operators_1.map((response) => {
            const data = response.data;
            return {
                ts: data.dt * 1000,
                temperature: data.main.temp,
                pressure: data.main.pressure,
                humidity: data.main.humidity
            };
        }));
        return result$;
    }
    scan() {
        return new Promise((resolve, reject) => {
            resolve([
                -1,
                0,
                1
            ]);
        });
    }
    write(_data) { }
    close() { }
}
exports.RemoteWeather = RemoteWeather;
//# sourceMappingURL=remoteweatherservice.js.map