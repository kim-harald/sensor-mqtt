import { Buffer } from 'buffer';
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP,
} from 'i2c-bus';
import { from, Observable, of, timer } from 'rxjs';
import { toKelvin } from '../common/common';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
import { WLogger } from './loggerservice';

const LM75A_ADDRESS_DEFAULT = 0x48;
const SAMPLE_INTERVAL_DEFAULT = 60000;
const _INTERVAL_DELAY = 15000;

export class LM75A implements ISensorDriver {
  private i2c1: I2CBusP | undefined = undefined;
  // todo: research these settings
  readonly GET_TEMP_CMD = 1;
  private _sampleInterval = 60000;

  private _address: number = LM75A_ADDRESS_DEFAULT;

  readonly _defaultData: Reading = {} as Reading;
  readonly _i2cOptions: I2COptions;

  constructor(options: any | undefined, i2c1?: I2CBusP) {
    this.i2c1 = i2c1;
    this._i2cOptions =
      (options?.I2C as I2COptions) ??
      ({
        address: LM75A_ADDRESS_DEFAULT,
        busNumber: 1,
        sampleInterval: SAMPLE_INTERVAL_DEFAULT,
      } as I2COptions);

    this._defaultData = options?.defaultData ?? ({} as Reading);

    this.open(this._i2cOptions.busNumber);
  }
  public get I2C1(): I2CBusP | undefined {
    return this.i2c1;
  }

  public async open(busNumber: number): Promise<void> {
    if (!this.i2c1) {
      this.i2c1 = await I2CBusOpen(busNumber);
    }

    this._sampleInterval = this._i2cOptions.sampleInterval;
    this._address = this._i2cOptions.address;

    WLogger.info(
      `IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`,
    );
  }

  public scan(): Observable<number[]> {
    return this.i2c1 ? from(this.i2c1.scan()) : of([]);
  }

  public async read(): Promise<Reading> {
    return this.getReading();
  }

  public write(data: unknown): void {
    throw new Error('Not implemented');
  }

  public close(): void {
    this.i2c1?.close();
  }

  private async getReading(): Promise<Reading> {
    try {
      if (!this.i2c1) {
        await this.open(this._i2cOptions.busNumber);
      }

      const buffer = Buffer.alloc(2);
      await this.i2c1!.readI2cBlock(this._address, 0x00, 2, buffer);
      const temperature = this.decodeTemp(buffer);
      const reading = {
        temperature: temperature,
        ts: new Date().valueOf(),
      } as Reading;
      return reading;
    } catch (error) {
      WLogger.info(error);
      return {} as Reading;
    }
  }

  private decodeTemp(buffer: Buffer): number {
    const rawData: number = (buffer[0] << 8) | buffer[1];
    const temp = rawData / 256;

    WLogger.debug(`temp:${temp};Kelvin:${toKelvin(temp)}`);
    return toKelvin(temp);
  }
}
