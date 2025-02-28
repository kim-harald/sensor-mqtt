import {
  MqqtService,
  SensorService,
  TrendService,
  WLogger,
  rotate,
  SyncService,
} from './services';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP,
} from 'i2c-bus';
import { gracefulShutdown, Job, scheduleJob } from 'node-schedule';
import { delay } from './common/common';
import config from './config/default.json';
import { Reading } from './models';
import { Db } from './data';
import os from 'os';

let intervalhandle: NodeJS.Timer;

run();

async function run() {
  const jobs: Record<string, Job> = {};

  try {
    const i2cbus =
      config.DeviceId !== 'Test'
        ? await I2CBusOpen(config.I2CBusNumber)
        : ({} as I2CBusP);

    const options = (config as any)[config.DeviceId];
    await SensorService.init(i2cbus, config.DeviceId, options);
    await MqqtService.init(
      config.mqtt.broker,
      config.mqtt.topic.replace('{hostname}', os.hostname()),
      config.mqtt.user,
      config.mqtt.pw,
    );

    await Db.init(config.Db, 10000);

    if (config.Sync) {
      jobs['sync'] = scheduleJob(config.syncSchedule, SyncService.execute);
      SyncService.execute();
    }

    const delayTime = 10 - (new Date().getSeconds() % 10);
    await delay(delayTime * 1000);
    intervalhandle = setInterval(async () => {
      try {
        const reading = await SensorService.read();

        await MqqtService.send('temperature', reading.temperature);
        await MqqtService.send('pressure', reading.pressure);
        await MqqtService.send('humidity', reading.humidity);

        const trend = processTrends(reading);
        await MqqtService.send('trend', trend);
      } catch (error) {
        WLogger.error(error);
      }
    }, config.sampleInterval);

    jobs['sensor'] = scheduleJob(config.sampleSchedule, sensorRead);

    process.on('SIGINT', () => {
      WLogger.info('Caught interrupt signal');
      WLogger.info('Performing shutdown');
      clearInterval(intervalhandle as NodeJS.Timeout);
      gracefulShutdown().then(() => {
        Object.values(jobs).forEach((job) => {
          if (job) {
            job.cancel();
          }
        });
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

const sensorRead = async () => {
  try {
    let reading = await SensorService.read();
    if (await MqqtService.send('all', reading)) {
      rotate(reading, config.deleteThreshold);
    }
  } catch (error) {
    WLogger.error(error);
  }
};

const processTrends = (reading: Reading): Record<string, number> => {
  const result = {
    temperature: TrendService.add(reading.temperature, 'temperature'),
    pressure: TrendService.add(reading.pressure, 'pressure'),
    humidity: TrendService.add(reading.humidity, 'humidity'),
  };

  WLogger.debug(JSON.stringify(result));

  return result;
};
