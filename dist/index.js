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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_json_1 = __importDefault(require("./config/default.json"));
const sensorservice_1 = require("./services/sensorservice");
const i2c_bus_1 = require("i2c-bus");
const mqqtservice_1 = require("./services/mqqtservice");
const node_schedule_1 = require("node-schedule");
const dbservice_1 = require("./data/dbservice");
const rotateService_1 = require("./services/rotateService");
const common_1 = require("./common/common");
run();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const i2cbus = yield i2c_bus_1.openPromisified(default_json_1.default.I2CBusNumber);
        const options = default_json_1.default[default_json_1.default.DeviceId];
        let job;
        let reading = { temperature: 0, humidity: 0, pressure: 0, ts: 0 };
        yield sensorservice_1.SensorService.init(i2cbus, default_json_1.default.DeviceId, options);
        yield mqqtservice_1.MqqtService.init(default_json_1.default.mqtt.broker, default_json_1.default.mqtt.topic, default_json_1.default.mqtt.user, default_json_1.default.mqtt.pw);
        yield dbservice_1.DbService.init(default_json_1.default.Db, 10000);
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const currentReading = yield sensorservice_1.SensorService.read();
            if (checkIfDataHasChanged(reading.temperature, currentReading.temperature, 1)) {
                reading.temperature = currentReading.temperature;
                mqqtservice_1.MqqtService.send('temperature', reading.temperature);
            }
            if (checkIfDataHasChanged(reading.pressure, currentReading.pressure, -2)) {
                reading.pressure = currentReading.pressure;
                mqqtservice_1.MqqtService.send('pressure', reading.pressure);
            }
            if (checkIfDataHasChanged(reading.humidity, currentReading.humidity, 0)) {
                reading.humidity = currentReading.humidity;
                mqqtservice_1.MqqtService.send('humidity', reading.humidity);
            }
        }), default_json_1.default.sampleInterval);
        const schedule = default_json_1.default.sampleSchedule;
        job = node_schedule_1.scheduleJob(schedule, execute);
        process.on('SIGINT', () => performShutdown);
    });
}
const execute = () => __awaiter(void 0, void 0, void 0, function* () {
    let reading = yield sensorservice_1.SensorService.read();
    if (yield mqqtservice_1.MqqtService.send('all', reading)) {
        rotateService_1.rotate(reading, default_json_1.default.deleteThreshold);
    }
    ;
});
const performShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    sensorservice_1.SensorService.close();
    yield mqqtservice_1.MqqtService.close();
    yield dbservice_1.DbService.close();
    process.exit();
});
const checkIfDataHasChanged = (oldValue, newValue, rounding) => {
    return common_1.rounded(oldValue, rounding) !== common_1.rounded(newValue, rounding);
};
//# sourceMappingURL=index.js.map