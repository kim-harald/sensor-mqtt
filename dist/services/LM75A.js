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
exports.LM75A = void 0;
const buffer_1 = require("buffer");
const i2c_bus_1 = require("i2c-bus");
const rxjs_1 = require("rxjs");
const common_1 = require("../common/common");
const loggerservice_1 = require("./loggerservice");
const LM75A_ADDRESS_DEFAULT = 0X48;
const SAMPLE_INTERVAL_DEFAULT = 60000;
const _INTERVAL_DELAY = 15000;
class LM75A {
    constructor(options, i2c1) {
        var _a, _b;
        this.i2c1 = undefined;
        this.GET_TEMP_CMD = 1;
        this._sampleInterval = 60000;
        this._address = LM75A_ADDRESS_DEFAULT;
        this._defaultData = {};
        this.i2c1 = i2c1;
        this._i2cOptions = (_a = options === null || options === void 0 ? void 0 : options.I2C) !== null && _a !== void 0 ? _a : {
            address: LM75A_ADDRESS_DEFAULT,
            busNumber: 1,
            sampleInterval: SAMPLE_INTERVAL_DEFAULT
        };
        this._defaultData = (_b = options === null || options === void 0 ? void 0 : options.defaultData) !== null && _b !== void 0 ? _b : {};
        this.open(this._i2cOptions.busNumber);
    }
    get I2C1() {
        return this.i2c1;
    }
    open(busNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.i2c1) {
                this.i2c1 = yield i2c_bus_1.openPromisified(busNumber);
            }
            this._sampleInterval = this._i2cOptions.sampleInterval;
            this._address = this._i2cOptions.address;
            loggerservice_1.WLogger.info(`IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`);
        });
    }
    scan() {
        return this.i2c1 ? rxjs_1.from(this.i2c1.scan()) : rxjs_1.of([]);
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getReading();
        });
    }
    write(data) {
        throw new Error('Not implemented');
    }
    close() {
        var _a;
        (_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.close();
    }
    getReading() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.i2c1) {
                    yield this.open(this._i2cOptions.busNumber);
                }
                const buffer = buffer_1.Buffer.alloc(2);
                yield this.i2c1.readI2cBlock(this._address, 0x00, 2, buffer);
                const temperature = this.decodeTemp(buffer);
                const reading = {
                    temperature: temperature,
                    ts: new Date().valueOf(),
                };
                return reading;
            }
            catch (error) {
                loggerservice_1.WLogger.info(error);
                return {};
            }
        });
    }
    decodeTemp(buffer) {
        const rawData = buffer[0] << 8 | buffer[1];
        const temp = rawData / 256;
        loggerservice_1.WLogger.debug(`temp:${temp};Kelvin:${common_1.toKelvin(temp)}`);
        return common_1.toKelvin(temp);
    }
}
exports.LM75A = LM75A;
//# sourceMappingURL=LM75A.js.map