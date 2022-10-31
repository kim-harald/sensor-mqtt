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
exports.BMX280 = void 0;
const i2c_bus_1 = require("i2c-bus");
const rxjs_1 = require("rxjs");
const common_1 = require("../common/common");
const loggerservice_1 = require("./loggerservice");
const SAMPLE_INTERVAL_DEFAULT = 600000;
const BMP280_ADDR = 0x77;
class BMX280 {
    constructor(options, i2c1) {
        var _a, _b;
        this.getTFine = (adc_T, cal1) => {
            const dig_T1 = getUShort(cal1, 0);
            const dig_T2 = getShort(cal1, 2);
            const dig_T3 = getShort(cal1, 4);
            const var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11;
            const var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14;
            const t_fine = var1 + var2;
            return t_fine;
        };
        this.compensateTemperature = (t_fine) => {
            const T = (t_fine * 5 + 128) >> 8;
            return T / 100;
        };
        this.compensatePressure = (adc_P, m_dig, t_fine) => {
            const dig_P1 = getUShort(m_dig, 6);
            const dig_P2 = getShort(m_dig, 8);
            const dig_P3 = getShort(m_dig, 10);
            const dig_P4 = getShort(m_dig, 12);
            const dig_P5 = getShort(m_dig, 14);
            const dig_P6 = getShort(m_dig, 16);
            const dig_P7 = getShort(m_dig, 18);
            const dig_P8 = getShort(m_dig, 20);
            const dig_P9 = getShort(m_dig, 22);
            let var1, var2;
            let pressure = 0.0;
            var1 = t_fine / 2.0 - 64000.0;
            var2 = var1 * var1 * dig_P6 / 32768.0;
            var2 = var2 + var1 * dig_P5 * 2.0;
            var2 = var2 / 4.0 + dig_P4 * 65536.0;
            var1 = (dig_P3 * var1 * var1 / 524288.0 + dig_P2 * var1) / 524288.0;
            var1 = (1.0 + var1 / 32768.0) * dig_P1;
            if (var1 == 0)
                return 0;
            pressure = 1048576.0 - adc_P;
            pressure = ((pressure - var2 / 4096.0) * 6250.0) / var1;
            var1 = dig_P9 * pressure * pressure / 2147483648.0;
            var2 = pressure * dig_P8 / 32768.0;
            pressure = pressure + (var1 + var2 + dig_P7) / 16.0;
            return pressure;
        };
        this.compensateHumidityPy = (adc_H, cal2, cal3, t_fine) => {
            const dig_H1 = getUChar(cal2, 0);
            const dig_H2 = getShort(cal3, 0);
            const dig_H3 = getUChar(cal3, 2);
            let dig_H4 = getChar(cal3, 3);
            dig_H4 = (dig_H4 << 24) >> 20;
            dig_H4 = dig_H4 | (getChar(cal3, 4) & 0x0f);
            let dig_H5 = getChar(cal3, 5);
            dig_H5 = (dig_H5 << 24) >> 20;
            dig_H5 = dig_H5 | ((getUChar(cal3, 4) >> 4) & 0x0f);
            const dig_H6 = getChar(cal3, 6);
            let humidity = t_fine - 76800.0;
            humidity =
                (adc_H - (dig_H4 * 64.0 + (dig_H5 / 16384.0) * humidity)) *
                    ((dig_H2 / 65536.0) *
                        (1.0 +
                            (dig_H6 / 67108864.0) *
                                humidity *
                                (1.0 + (dig_H3 / 67108864.0) * humidity)));
            humidity = humidity * (1.0 - (dig_H1 * humidity) / 524288.0);
            if (humidity > 100) {
                humidity = 100;
            }
            else if (humidity < 0) {
                humidity = 0;
            }
            return humidity;
        };
        this.compensateHumidity = (adc_H, cal2, cal3, t_fine) => {
            const dig_H1 = getUChar(cal2, 0);
            const dig_H2 = getShort(cal3, 0);
            const dig_H3 = getUChar(cal3, 2);
            const dig_H6 = getUChar(cal3, 6);
            let dig_H4 = getChar(cal3, 3);
            dig_H4 = (dig_H4 << 24) >> 20;
            dig_H4 = dig_H4 | (getChar(cal3, 4) & 0x0f);
            let dig_H5 = getChar(cal3, 5);
            dig_H5 = (dig_H5 << 24) >> 20;
            dig_H5 = dig_H5 | ((getUChar(cal3, 4) >> 4) & 0x0f);
            const var1 = t_fine - 76800.0;
            const var2 = (dig_H4 * 64.0 + ((dig_H5) / 16384.0) * var1);
            const var3 = adc_H - var2;
            const var4 = (dig_H2) / 65536.0;
            const var5 = (1.0 + ((dig_H3) / 67108864.0) * var1);
            let var6 = 1.0 + ((dig_H6) / 67108864.0) * var1 * var5;
            var6 = var3 * var4 * (var5 * var6);
            const humidity = var6 * (1.0 - dig_H1 * var6 / 524288.0);
            if (humidity > 100) {
                return 100;
            }
            else if (humidity < 0) {
                return 0;
            }
            else {
                return humidity;
            }
        };
        this._defaultData = {};
        this._address = BMP280_ADDR;
        this._i2cOptions =
            (_a = options === null || options === void 0 ? void 0 : options.I2C) !== null && _a !== void 0 ? _a : {
                address: BMP280_ADDR,
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
    get I2C1() {
        return this.i2c1;
    }
    set I2C1(v) {
        this.i2c1 = v;
    }
    open(busNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.i2c1) {
                this.i2c1 = yield i2c_bus_1.openPromisified(busNumber);
            }
            loggerservice_1.WLogger.info(`IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`);
            try {
                yield this.getChipID();
            }
            catch (error) {
                loggerservice_1.WLogger.error('Device is not ready', error);
                throw error;
            }
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.readSamples(8, 1);
        });
    }
    readSamples(n, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let samples = [];
            for (let i = 0; i < n; i++) {
                samples.push(yield this.getReading());
            }
            samples = samples.slice(skip, n - 1);
            const t = common_1.rounded(mean(samples.map(m => m.temperature)), 2);
            const p = common_1.rounded(mean(samples.map(m => m.pressure)), 0);
            const h = common_1.rounded(samples[0].humidity, 1);
            const reading = samples[samples.length - 1];
            return Object.assign(Object.assign({}, reading), { temperature: t, pressure: p, humidity: h });
        });
    }
    write(data) {
        loggerservice_1.WLogger.info(`data:${data}`);
        throw new Error('Not implemented');
    }
    close() {
        var _a;
        (_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.close();
    }
    getChipID() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const BME280_REGISTER_CHIPID = 0xD0;
            const data = Buffer.alloc(1);
            yield ((_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.readI2cBlock(this._address, BME280_REGISTER_CHIPID, 1, data));
            return data.readUInt8(0);
        });
    }
    getReading() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            const REG_DATA = 0xf7;
            const STANDBY_TIME = 7;
            const REG_CONTROL = 0xf4;
            const FILTER = 0;
            const REG_CONTROL_HUM = 0xf2;
            const OVERSAMPLE_TEMP = 4;
            const OVERSAMPLE_PRES = 4;
            const MODE = 1;
            if (!this.i2c1) {
                this.open(this._i2cOptions.busNumber);
            }
            const OVERSAMPLE_HUM = 2;
            yield ((_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.writeByte(this._address, REG_CONTROL_HUM, OVERSAMPLE_HUM));
            const control = (OVERSAMPLE_TEMP << 5) | (OVERSAMPLE_PRES << 2) | MODE;
            yield ((_b = this.i2c1) === null || _b === void 0 ? void 0 : _b.writeByte(this._address, REG_CONTROL, control));
            yield this.setSampling(MODE, OVERSAMPLE_TEMP, OVERSAMPLE_PRES);
            yield this.setConfig(STANDBY_TIME, FILTER, 0);
            const cal1 = Buffer.alloc(24);
            const cal2 = Buffer.alloc(1);
            const cal3 = Buffer.alloc(7);
            yield ((_c = this.i2c1) === null || _c === void 0 ? void 0 : _c.readI2cBlock(this._address, 0x88, 24, cal1));
            yield ((_d = this.i2c1) === null || _d === void 0 ? void 0 : _d.readI2cBlock(this._address, 0xa1, 1, cal2));
            yield ((_e = this.i2c1) === null || _e === void 0 ? void 0 : _e.readI2cBlock(this._address, 0xe1, 7, cal3));
            const wait_time = 1.25 +
                2.3 * OVERSAMPLE_TEMP +
                (2.3 * OVERSAMPLE_PRES + 0.575) +
                (2.3 * OVERSAMPLE_HUM + 0.575) + 10;
            yield rxjs_1.delay(wait_time);
            const data = Buffer.alloc(8);
            yield ((_f = this.i2c1) === null || _f === void 0 ? void 0 : _f.readI2cBlock(this._address, REG_DATA, 8, data));
            const adc_P = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
            const adc_T = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
            const adc_H = (data[6] << 8) | data[7];
            const t_fine = this.getTFine(adc_T, cal1);
            const temperature = this.compensateTemperature(t_fine) + common_1.cKelvinOffset;
            const pressure = this.compensatePressure(adc_P, cal1, t_fine);
            const humidity = this.compensateHumidity(adc_H, cal2, cal3, t_fine);
            const reading = {
                ts: new Date().valueOf(),
                temperature: temperature,
                humidity: humidity,
                pressure: pressure,
                device: 'BME280'
            };
            return reading;
        });
    }
    setSampling(mode, tempSampling, pressSampling) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const REG_CONTROL = 0xf4;
            const control = (tempSampling << 5) | (pressSampling << 2) | mode;
            yield ((_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.writeByte(this._address, REG_CONTROL, control));
        });
    }
    setConfig(t_sb, filter, spi3w_en) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const REG_CONTROL_CONFIG = 0xf5;
            const control = (t_sb << 5) | (filter << 2) | spi3w_en;
            yield ((_a = this.i2c1) === null || _a === void 0 ? void 0 : _a.writeByte(this._address, REG_CONTROL_CONFIG, control));
        });
    }
}
exports.BMX280 = BMX280;
const getUShort = (data, index) => {
    return data.readUInt16LE(index);
};
const getShort = (data, index) => {
    return data.readInt16LE(index);
};
const getChar = (data, index) => {
    return data.readInt8(index);
};
const getUChar = (data, index) => {
    return data.readUInt8(index);
};
const mean = (arr) => {
    const sum = arr.reduce((a, b) => a + b);
    return sum / arr.length;
};
//# sourceMappingURL=BMX280.js.map