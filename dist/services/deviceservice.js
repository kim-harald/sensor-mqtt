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
exports.DeviceService = void 0;
const BMX280_1 = require("./BMX280");
const LM75A_1 = require("./LM75A");
let i2cBus;
let options = {};
let devices = {};
const init = (deviceId, bus) => __awaiter(void 0, void 0, void 0, function* () {
    i2cBus = bus;
    devices = {
        "BMX280": new BMX280_1.BMX280(options, i2cBus),
        "LM75A": new LM75A_1.LM75A(options, i2cBus),
    };
    yield devices[deviceId].open(1);
});
const read = (deviceId) => __awaiter(void 0, void 0, void 0, function* () {
    return devices[deviceId].read();
});
const close = (deviceId) => {
    devices[deviceId].close();
};
exports.DeviceService = {
    init, read, close
};
//# sourceMappingURL=deviceservice.js.map