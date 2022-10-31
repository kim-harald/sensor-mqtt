"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WLogger = void 0;
const winston_1 = require("winston");
const default_json_1 = __importDefault(require("../config/default.json"));
require("winston-daily-rotate-file");
const { combine } = winston_1.format;
const logger = winston_1.createLogger({
    level: default_json_1.default.logLevel,
    transports: [
        new winston_1.transports.DailyRotateFile({
            filename: 'weather-%DATE%.log',
            dirname: default_json_1.default.logPath,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: default_json_1.default.logLevel,
            format: combine(winston_1.format.simple(), winston_1.format.timestamp(), winston_1.format.prettyPrint()),
            maxFiles: '30d'
        }),
        new winston_1.transports.Console({
            level: 'error',
            format: combine(winston_1.format.splat(), winston_1.format.simple(), winston_1.format.colorize())
        }),
        new winston_1.transports.Console({
            level: 'info',
            format: combine(winston_1.format.splat(), winston_1.format.simple(), winston_1.format.colorize())
        })
    ]
});
exports.WLogger = logger;
//# sourceMappingURL=loggerservice.js.map