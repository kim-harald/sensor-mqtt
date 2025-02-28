import config from './config/default.json';
import { SensorService } from './services/sensorservice';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP,
} from 'i2c-bus';
import { MqqtService, ReadingType } from './services/mqqtservice';
import { gracefulShutdown, Job, scheduleJob } from 'node-schedule';
import { Db } from './data/dbservice';
import { rotate } from './services/rotateService';
import { Reading } from './models/reading';
import { delay, rounded } from './common/common';
import { WLogger } from './services/loggerservice';
import { TrendService } from './services/trendservice';

const samples: number[] = [];
for (let i = 0; i < 50; i++) {
  samples.push(0);
}

for (let i = 0; i < 80; i++) {
  samples.push(1);
}

run();

async function run() {
  try {
    for (let v of samples) {
      TrendService.add(v, 'temperature');
      TrendService.add(v + 1, 'pressure');
      TrendService.add(v + 2, 'humidity');
    }

    console.log(TrendService.trend['temperature']);
    console.log(TrendService.trend['pressure']);
    console.log(TrendService.trend['humidity']);
  } catch (error) {
    WLogger.error(error);
  }
}

const processTrends = (reading: Reading): Record<string, number> => {
  const result = {
    temperature: TrendService.add(reading.temperature, 'temperature'),
    pressure: TrendService.add(reading.pressure, 'pressure'),
    humidity: TrendService.add(reading.humidity, 'humidity'),
  };

  WLogger.debug(JSON.stringify(result));

  return result;
};
