/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP,
} from 'i2c-bus';
import { delay } from 'rxjs';
import { cKelvinOffset } from '../common/common';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
import { WLogger } from './loggerservice';

const AHT10_ADDR = 0x38;
const SAMPLE_INTERVAL_DEFAULT = 600000;

export class ATH10 implements ISensorDriver {
  private i2c1!: I2CBusP;
  readonly _defaultData: Reading = {} as Reading;
  readonly _address: number = AHT10_ADDR;
  readonly _i2cOptions: I2COptions;

  constructor(options?: any, i2c1?: I2CBusP) {
    this._i2cOptions =
      (options?.I2C as I2COptions) ??
      ({
        address: AHT10_ADDR,
        busNumber: 1,
        sampleInterval: SAMPLE_INTERVAL_DEFAULT,
      } as I2COptions);

    this._defaultData = options?.defaultData ?? ({} as Reading);
    this._address = this._i2cOptions.address;

    if (i2c1) {
      this.i2c1 = i2c1;
    } else {
      this.open(this._i2cOptions.busNumber);
    }
  }

  public read(): Promise<Reading> {
    return this.getReading();
  }

  public async getReading(): Promise<Reading> {
    const config = Buffer.from([0x08, 0x00]);
    await this.i2c1.writeI2cBlock(AHT10_ADDR, 0xe1, 2, config);

    await delay(75);

    const b = await this.i2c1.readByte(AHT10_ADDR, 0);

    const measureCmd = Buffer.from([0x33, 0x00]);
    await this.i2c1.writeI2cBlock(AHT10_ADDR, 0xac, 2, measureCmd);
    await delay(75);
    const data = Buffer.alloc(5);
    await this.i2c1.readI2cBlock(AHT10_ADDR, 0x00, 5, data);
    const temp = ((data[2] & 0x0f) << 16) | (data[3] << 8) | data[4];
    const cTemp = (temp * 200) / 1048576 - 50;
    const humidity = (data[0] << 16) | (data[1] << 8) | (data[2] >> 4);
    const cHumidity = Math.round((humidity * 100) / 1048576);

    return {
      ts: new Date().valueOf(),
      humidity: cHumidity,
      temperature: cTemp + cKelvinOffset,
    } as Reading;
  }

  write(data: unknown): void {
    throw new Error('Method not implemented.');
  }
  close(): void {
    throw new Error('Method not implemented.');
  }

  public async open(busNumber: number): Promise<void> {
    if (!this.i2c1) {
      this.i2c1 = await I2CBusOpen(busNumber);
    }

    WLogger.info(
      `IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`,
    );

    try {
      await this.initCmd(); // test if device is active and ready
    } catch (error) {
      WLogger.error('Device is not ready', error);
      throw error;
    }
  }

  private async initCmd(): Promise<void> {
    const config = Buffer.from([0x08, 0x00]);
    await this.i2c1.writeI2cBlock(AHT10_ADDR, 0xe1, 2, config);
  }
}
