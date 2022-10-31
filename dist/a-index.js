"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const MQTT = __importStar(require("async-mqtt"));
run();
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield MQTT.connectAsync('mqtt://localhost:1883');
        console.log('Starting');
        try {
            yield client.publish('x5-ff7', 'Begin');
            let i = 9;
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield client.publish('x5-ff7', i.toString());
                i++;
                if (i > 20) {
                    yield client.publish('x5-ff7', 'End');
                    process.exit();
                }
            }), 1000);
        }
        catch (e) {
            console.error(e.stack);
            process.exit();
        }
    });
}
//# sourceMappingURL=a-index.js.map