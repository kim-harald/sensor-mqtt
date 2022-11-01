import { createLogger, format, transports } from 'winston';
import settings from '../config/default.json';
import 'winston-daily-rotate-file';

const { combine } = format;

const logger = createLogger({
    level: settings.logLevel,
    transports: [
        new transports.DailyRotateFile({
            filename: 'weather-%DATE%.log',
            dirname: settings.logPath,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            level: settings.logLevel,
            format: combine(format.simple(), format.timestamp(), format.prettyPrint()),
            maxFiles: '30d'
        }),
        new transports.Console({
            level: 'error',
            format: combine(format.splat(), format.simple(), format.colorize())
        }),
        new transports.Console({
            level: 'info',
            format: combine(format.splat(), format.simple(), format.colorize())
        })

    ]
});


export const WLogger = logger;
