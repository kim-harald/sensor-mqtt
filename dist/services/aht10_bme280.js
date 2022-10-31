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
exports.AHT10_BMX280 = void 0;
const aht10_1 = require("./aht10");
const BMX280_1 = require("./BMX280");
class AHT10_BMX280 {
    constructor(aht10Options, bmx280Options, i2cbus) {
        this.i2c1 = i2cbus;
        this.aht10 = new aht10_1.ATH10(aht10Options, this.i2c1);
        this.bmx280 = new BMX280_1.BMX280(bmx280Options, i2cbus);
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const ath10Reading = yield this.aht10.read();
            const bmx280Reading = yield this.bmx280.read();
            return Object.assign(Object.assign({}, bmx280Reading), { humidity: ath10Reading.humidity });
        });
    }
    write(data) {
        throw new Error("Method not implemented.");
    }
    close() {
        throw new Error("Method not implemented.");
    }
    open(options) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.AHT10_BMX280 = AHT10_BMX280;
//# sourceMappingURL=aht10_bme280.js.map