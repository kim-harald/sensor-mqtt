import { BMX280 } from './BMX280';
import { ISensorDriver } from './isensordriver';
import { PromisifiedBus } from 'i2c-bus';
import { LM75A } from './LM75A';
import { Reading } from '../models/reading';
import { ATH10 } from './aht10';
import { SensorTestService } from './sensortestservice';
import { AHT10_BMX280 } from './aht10_bme280';
import { v4 as uuidv4 } from 'uuid';

let _sensorDriver: ISensorDriver;

const init = async (
  i2cBus: PromisifiedBus,
  deviceId: string,
  config: any,
): Promise<void> => {
  _sensorDriver = getSensor(deviceId, i2cBus, config);
  await _sensorDriver.open();
};

const read = async (): Promise<Reading> => {
  const reading = await _sensorDriver.read();
  const id = uuidv4().toString();
  reading.id = id;
  return reading;
};

const close = (): void => {
  _sensorDriver.close();
};

const getSensor = (
  deviceId: string,
  i2cbus: PromisifiedBus,
  config: any,
): ISensorDriver => {
  switch (deviceId) {
    case 'LM75A':
      return new LM75A({ I2C: config }, i2cbus);
    case 'BMX280':
      return new BMX280({ I2C: config }, i2cbus);
    case 'AHT10':
      return new ATH10({ I2C: config }, i2cbus);
    // case 'AHT10_BMX280':
    //     return new AHT10_BMX280({I2C:config},{I2C:config},i2cbus);
    case 'Test':
      return new SensorTestService({});
    default:
      throw Error(`Unknown device ${deviceId}`);
  }
};

export const SensorService = {
  init,
  read,
  close,
};
