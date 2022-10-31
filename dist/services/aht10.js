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
exports.ATH10 = void 0;
const i2c_bus_1 = require("i2c-bus");
const rxjs_1 = require("rxjs");
const common_1 = require("../common/common");
const loggerservice_1 = require("./loggerservice");
const AHT10_ADDR = 0x38;
const SAMPLE_INTERVAL_DEFAULT = 600000;
class ATH10 {
    constructor(options, i2c1) {
        var _a, _b;
        this._defaultData = {};
        this._address = AHT10_ADDR;
        this._i2cOptions =
            (_a = options === null || options === void 0 ? void 0 : options.I2C) !== null && _a !== void 0 ? _a : {
                address: AHT10_ADDR,
                busNumber: 1,
                sampleInterval: SAMPLE_INTERVAL_DEFAULT
            };
        this._defaultData = (_b = options === null || options === void 0 ? void 0 : options.defaultData) !== null && _b !== void 0 ? _b : {};
        this._address = this._i2cOptions.address;
        if (i2c1) {
            this.i2c1 = i2c1;
        }
        else {
            this.open(this._i2cOptions.busNumber);
        }
    }
    read() {
        return this.getReading();
    }
    getReading() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = Buffer.from([
                0x08,
                0x00
            ]);
            yield this.i2c1.writeI2cBlock(AHT10_ADDR, 0xE1, 2, config);
            yield rxjs_1.delay(75);
            const b = yield this.i2c1.readByte(AHT10_ADDR, 0);
            const measureCmd = Buffer.from([
                0x33,
                0x00
            ]);
            yield this.i2c1.writeI2cBlock(AHT10_ADDR, 0xAC, 2, measureCmd);
            yield rxjs_1.delay(75);
            const data = Buffer.alloc(5);
            yield this.i2c1.readI2cBlock(AHT10_ADDR, 0x00, 5, data);
            const temp = ((data[2] & 0x0F) << 16) | (data[3] << 8) | data[4];
            const cTemp = ((temp * 200) / 1048576) - 50;
            const humidity = ((data[0] << 16) | (data[1] << 8) | data[2] >> 4);
            const cHumidity = Math.round(humidity * 100 / 1048576);
            return {
                ts: new Date().valueOf(),
                humidity: cHumidity,
                temperature: cTemp + common_1.cKelvinOffset,
            };
        });
    }
    write(data) {
        throw new Error("Method not implemented.");
    }
    close() {
        throw new Error("Method not implemented.");
    }
    open(busNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.i2c1) {
                this.i2c1 = yield i2c_bus_1.openPromisified(busNumber);
            }
            loggerservice_1.WLogger.info(`IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`);
            try {
                yield this.initCmd();
            }
            catch (error) {
                loggerservice_1.WLogger.error('Device is not ready', error);
                throw error;
            }
        });
    }
    initCmd() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = Buffer.from([
                0x08,
                0x00
            ]);
            yield this.i2c1.writeI2cBlock(AHT10_ADDR, 0xE1, 2, config);
        });
    }
}
exports.ATH10 = ATH10;
//# sourceMappingURL=aht10.js.map