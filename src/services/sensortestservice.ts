import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
import { WLogger } from './loggerservice';

const ADDRESS_DEFAULT = 0X48;

export class SensorTestService implements ISensorDriver {

  private i2c1: Record<string,unknown> = {};
  private GET_TEMP_CMD = 1;
  private _address = 0x00;

  private _defaultData: Reading = {} as Reading;

  constructor(options: any | undefined) {
    this.open(options);
  }

  public async open(options: any | undefined): Promise<void> {
    const i2cOptions = options?.I2C as I2COptions ?? {
      address: ADDRESS_DEFAULT,
      busNumber: 1,
    } as I2COptions;

    this._defaultData = options?.defaultData ?? {} as Reading;
    this._address = i2cOptions.address;

    WLogger.info(`IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`);
    WLogger.info(`${JSON.stringify(options)}`);
  }

  read(): Promise<Reading> {
    return this.getRandomSample();
  }

  public async readAsync(): Promise<Reading> {
    return await this.getRandomSample();
  }

  private async getRandomSample(): Promise<Reading> {
    return {
      ts: new Date().valueOf(),
      humidity: Math.round(Math.random() * 70) + 30,
      pressure: (Math.round(Math.random() * 2000) + 98500),
      temperature: Math.round(Math.random() * 1000 - 500) / 40,
    } as Reading;
  }

  write(data: any): void {
    throw new Error('Not implemented');
  }

  close(): void { 
    //
  }

  scan(): Promise<number[]> {
    return new Promise<number[]>(resolve => {
      resolve([
        0,
        1,
        2
      ]);
    });
  }
}


