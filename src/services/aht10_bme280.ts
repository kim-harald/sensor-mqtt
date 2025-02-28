import { Reading } from '../models/reading';
import { ISensorDriver } from './isensordriver';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP,
} from 'i2c-bus';
import { ATH10 } from './aht10';
import { BMX280 } from './BMX280';

export class AHT10_BMX280 implements ISensorDriver {
  private readonly i2c1: I2CBusP;
  private readonly aht10: ATH10;
  private readonly bmx280: BMX280;

  constructor(aht10Options: any, bmx280Options: any, i2cbus: I2CBusP) {
    this.i2c1 = i2cbus;
    this.aht10 = new ATH10(aht10Options, this.i2c1);
    this.bmx280 = new BMX280(bmx280Options, i2cbus);
  }

  async read(): Promise<Reading> {
    const ath10Reading = await this.aht10.read();
    const bmx280Reading = await this.bmx280.read();
    return {
      ...bmx280Reading,
      humidity: ath10Reading.humidity,
    };
  }

  write(data: unknown): void {
    throw new Error('Method not implemented.');
  }

  close(): void {
    throw new Error('Method not implemented.');
  }
  async open(options?: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
