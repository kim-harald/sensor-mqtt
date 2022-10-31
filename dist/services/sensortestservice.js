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
exports.SensorTestService = void 0;
const loggerservice_1 = require("./loggerservice");
const ADDRESS_DEFAULT = 0X48;
class SensorTestService {
    constructor(options) {
        this.i2c1 = {};
        this.GET_TEMP_CMD = 1;
        this._address = 0x00;
        this._defaultData = {};
        this.open(options);
    }
    open(options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const i2cOptions = (_a = options === null || options === void 0 ? void 0 : options.I2C) !== null && _a !== void 0 ? _a : {
                address: ADDRESS_DEFAULT,
                busNumber: 1,
            };
            this._defaultData = (_b = options === null || options === void 0 ? void 0 : options.defaultData) !== null && _b !== void 0 ? _b : {};
            this._address = i2cOptions.address;
            loggerservice_1.WLogger.info(`IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`);
            loggerservice_1.WLogger.info(`${JSON.stringify(options)}`);
        });
    }
    read() {
        return this.getRandomSample();
    }
    readAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getRandomSample();
        });
    }
    getRandomSample() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                ts: new Date().valueOf(),
                humidity: Math.round(Math.random() * 70) + 30,
                pressure: (Math.round(Math.random() * 2000) + 98500),
                temperature: Math.round(Math.random() * 1000 - 500) / 40,
            };
        });
    }
    write(data) {
        throw new Error('Not implemented');
    }
    close() {
    }
    scan() {
        return new Promise(resolve => {
            resolve([
                0,
                1,
                2
            ]);
        });
    }
}
exports.SensorTestService = SensorTestService;
//# sourceMappingURL=sensortestservice.js.map