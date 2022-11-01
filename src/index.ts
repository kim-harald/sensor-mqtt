import config from './config/default.json';
import { SensorService } from './services/sensorservice';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP
} from 'i2c-bus';
import { MqqtService, ReadingType } from './services/mqqtservice';
import { Job, scheduleJob } from 'node-schedule';
import { Db } from './data/dbservice';
import { rotate } from './services/rotateService';
import { Reading } from './models/reading';
import { rounded } from './common/common';

run();

async function run() {
  const i2cbus = await I2CBusOpen(config.I2CBusNumber);
  const options = (config as any)[config.DeviceId];
  let job: Job;
  let reading:Reading = { temperature:0,humidity:0,pressure:0, ts:0};
  
  await SensorService.init(i2cbus, config.DeviceId, options);
  await MqqtService.init(config.mqtt.broker, config.mqtt.topic, config.mqtt.user, config.mqtt.pw);
  await Db.init(config.Db, 10000);

  setInterval(async () => {
    const currentReading = await SensorService.read();
    
    if (checkIfDataHasChanged(reading.temperature,currentReading.temperature,1)) {
      reading.temperature = currentReading.temperature;
      MqqtService.send('temperature', reading.temperature);
    }
    
    if (checkIfDataHasChanged(reading.pressure,currentReading.pressure,-2)) {
      reading.pressure = currentReading.pressure;
      MqqtService.send('pressure', reading.pressure);
    }

    if (checkIfDataHasChanged(reading.humidity,currentReading.humidity,0)) {
      reading.humidity = currentReading.humidity;
      MqqtService.send('humidity', reading.humidity);
    }

  }, config.sampleInterval);

  const schedule = config.sampleSchedule;
  job = scheduleJob(schedule, execute);

  process.on('SIGINT', () => performShutdown);
}

const execute = async () => {

  let reading = await SensorService.read();
  if (await MqqtService.send('all', reading)) {
    rotate(reading,config.deleteThreshold);
  };
}

const performShutdown = async():Promise<void> => {
  SensorService.close();
  await MqqtService.close();
  await Db.close();
  process.exit();
}

const checkIfDataHasChanged = (oldValue:number, newValue:number,rounding:number) => {
  return rounded(oldValue,rounding) !== rounded(newValue,rounding);
}

