import config from './config/default.json';
import { SensorService } from './services/sensorservice';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP
} from 'i2c-bus';
import { MqqtService, ReadingType } from './services/mqqtservice';
import { gracefulShutdown, Job, scheduleJob } from 'node-schedule';
import { Db } from './data/dbservice';
import { rotate } from './services/rotateService';
import { Reading } from './models/reading';
import { delay, rounded } from './common/common';
import { WLogger } from './services/loggerservice';
import { TrendService } from './services/trendservice';

let intervalhandle: NodeJS.Timer;

run();

async function run() {
  try {
    const i2cbus = await I2CBusOpen(config.I2CBusNumber);
    const options = (config as any)[config.DeviceId];
    await SensorService.init(i2cbus, config.DeviceId, options);
    await MqqtService.init(config.mqtt.broker, config.mqtt.topic, config.mqtt.user, config.mqtt.pw);
    await Db.init(config.Db, 10000);

    const delayTime = 10 - new Date().getSeconds() % 10;
    await delay(delayTime*1000);
    intervalhandle = setInterval(async () => {
      const reading = await SensorService.read();

      MqqtService.send('temperature', reading.temperature);
      MqqtService.send('pressure', reading.pressure);
      MqqtService.send('humidity', reading.humidity);
      
      const trend = processTrends(reading);
      MqqtService.send('trend',trend);

    }, config.sampleInterval);

    const schedule = config.sampleSchedule;
    const job = scheduleJob(schedule, execute);

    process.on('SIGINT', () => {
      WLogger.info('Caught interrupt signal');
      WLogger.info('Performing shutdown');
      clearTimeout(intervalhandle);
      gracefulShutdown().then(() => {
        job.cancel();
        SensorService.close();
        WLogger.info('Closing sensor service');
        MqqtService.close();
        WLogger.info('Closing Mqtt service');
        Db.close();
        WLogger.info('Closing db');
        process.exit();
      });
    });
  } catch (error) {
    WLogger.error(error);
  }
}

const execute = async () => {

  let reading = await SensorService.read();
  if (await MqqtService.send('all', reading)) {
    rotate(reading, config.deleteThreshold);
  };
}

const processTrends = (reading:Reading):Record<string,number> => {
  return {
    temperature: TrendService.add(reading.temperature, 'temperature'),
    pressure:TrendService.add(reading.pressure, 'pressure'),
    humidity:TrendService.add(reading.humidity, 'humidity'),
  }
}

