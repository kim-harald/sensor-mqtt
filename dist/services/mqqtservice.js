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
exports.MqqtService = void 0;
const async_mqtt_1 = require("async-mqtt");
const rxjs_1 = require("rxjs");
let client;
let baseTopic;
const topics = {};
const init = (brokerUri, topic, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        username,
        password,
        rejectUnauthorized: false
    };
    client = yield async_mqtt_1.connectAsync(brokerUri, options);
    baseTopic = topic;
});
const send = (readingType, data) => __awaiter(void 0, void 0, void 0, function* () {
    topics[readingType] = baseTopic + '/' + readingType;
    const json = readingType === 'all'
        ? JSON.stringify(data)
        : data.toString();
    yield client.publish(topics[readingType], json);
    return true;
});
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    Object.keys(topics).forEach(key => {
        client.unsubscribe(topics[key]);
    });
});
const subscribeTopic = (readingType) => {
    topics[readingType] = baseTopic + '/' + readingType;
    client.subscribe(topics[readingType]);
    return new rxjs_1.Observable(s => {
        client.on('message', (topic, buffer) => {
            const data = Buffer.from(buffer);
            const json = JSON.parse(data.toString());
            if (readingType !== 'all') {
                const x = json;
                s.next(x);
            }
            const y = Number(json);
            s.next(y);
        });
    });
};
exports.MqqtService = { init, send, close, subscribeTopic };
//# sourceMappingURL=mqqtservice.js.map