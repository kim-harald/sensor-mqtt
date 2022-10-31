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
exports.SensorService = void 0;
const BMX280_1 = require("./BMX280");
const LM75A_1 = require("./LM75A");
const aht10_1 = require("./aht10");
const sensortestservice_1 = require("./sensortestservice");
let _sensorDriver;
const init = (i2cBus, deviceId, config) => __awaiter(void 0, void 0, void 0, function* () {
    _sensorDriver = getSensor(deviceId, i2cBus, config);
    yield _sensorDriver.open();
});
const read = () => __awaiter(void 0, void 0, void 0, function* () {
    return _sensorDriver.read();
});
const close = () => {
    _sensorDriver.close();
};
const getSensor = (deviceId, i2cbus, config) => {
    switch (deviceId) {
        case 'LM75A':
            return new LM75A_1.LM75A({ I2C: config.LM75A }, i2cbus);
        case 'BME280':
            return new BMX280_1.BMX280({ I2C: config.BMX280 }, i2cbus);
        case 'AHT10':
            return new aht10_1.ATH10({ I2C: config.ATH10 }, i2cbus);
        case 'Test':
            return new sensortestservice_1.SensorTestService({});
        default:
            throw Error(`Unknown device ${deviceId}`);
    }
};
exports.SensorService = {
    init, read, close
};
//# sourceMappingURL=sensorservice.js.map