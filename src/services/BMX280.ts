/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  openPromisified as I2CBusOpen,
  PromisifiedBus as I2CBusP
} from 'i2c-bus';
import { delay, from, Observable } from 'rxjs';
import { rounded, cKelvinOffset } from '../common/common';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
import { WLogger } from './loggerservice';

const SAMPLE_INTERVAL_DEFAULT = 600000;
const BMP280_ADDR = 0x77;

export class BMX280 implements ISensorDriver {
  private i2c1!: I2CBusP;
  private getTFine = (adc_T: number, cal1: Buffer): number => {
    const dig_T1 = getUShort(cal1, 0);
    const dig_T2 = getShort(cal1, 2);
    const dig_T3 = getShort(cal1, 4);

    const var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11;
    const var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14;
    const t_fine = var1 + var2;
    return t_fine;
  };
  private compensateTemperature = (t_fine: number): number => {
    const T = (t_fine * 5 + 128) >> 8;
    return T / 100;
  };
  private compensatePressure = (adc_P: number, m_dig: Buffer, t_fine: number): number => {
    const dig_P1 = getUShort(m_dig, 6);
    const dig_P2 = getShort(m_dig, 8);
    const dig_P3 = getShort(m_dig, 10);
    const dig_P4 = getShort(m_dig, 12);
    const dig_P5 = getShort(m_dig, 14);
    const dig_P6 = getShort(m_dig, 16);
    const dig_P7 = getShort(m_dig, 18);
    const dig_P8 = getShort(m_dig, 20);
    const dig_P9 = getShort(m_dig, 22);

    let var1, var2;
    let pressure = 0.0;

    var1 = t_fine / 2.0 - 64000.0;
    var2 = var1 * var1 * dig_P6 / 32768.0;
    var2 = var2 + var1 * dig_P5 * 2.0;
    var2 = var2 / 4.0 + dig_P4 * 65536.0;
    var1 = (dig_P3 * var1 * var1 / 524288.0 + dig_P2 * var1) / 524288.0;
    var1 = (1.0 + var1 / 32768.0) * dig_P1;

    if (var1 == 0) return 0;

    pressure = 1048576.0 - adc_P;
    pressure = ((pressure - var2 / 4096.0) * 6250.0) / var1;
    var1 = dig_P9 * pressure * pressure / 2147483648.0;
    var2 = pressure * dig_P8 / 32768.0;
    pressure = pressure + (var1 + var2 + dig_P7) / 16.0;
    return pressure;
  };
  private compensateHumidityPy = (
    adc_H: number,
    cal2: Buffer,
    cal3: Buffer,
    t_fine: number
  ) => {
    const dig_H1 = getUChar(cal2, 0);
    const dig_H2 = getShort(cal3, 0);
    const dig_H3 = getUChar(cal3, 2);

    let dig_H4 = getChar(cal3, 3);
    dig_H4 = (dig_H4 << 24) >> 20;
    dig_H4 = dig_H4 | (getChar(cal3, 4) & 0x0f);

    let dig_H5 = getChar(cal3, 5);
    dig_H5 = (dig_H5 << 24) >> 20;
    dig_H5 = dig_H5 | ((getUChar(cal3, 4) >> 4) & 0x0f);

    const dig_H6 = getChar(cal3, 6);

    let humidity = t_fine - 76800.0;
    humidity =
      (adc_H - (dig_H4 * 64.0 + (dig_H5 / 16384.0) * humidity)) *
      ((dig_H2 / 65536.0) *
        (1.0 +
          (dig_H6 / 67108864.0) *
          humidity *
          (1.0 + (dig_H3 / 67108864.0) * humidity)));
    humidity = humidity * (1.0 - (dig_H1 * humidity) / 524288.0);

    if (humidity > 100) {
      humidity = 100;
    } else if (humidity < 0) {
      humidity = 0;
    }

    return humidity;
  };

  private compensateHumidity = (adc_H: number, cal2: Buffer, cal3: Buffer, t_fine: number): number => {

    const dig_H1 = getUChar(cal2, 0);
    const dig_H2 = getShort(cal3, 0);
    const dig_H3 = getUChar(cal3, 2);
    const dig_H6 = getUChar(cal3, 6);

    let dig_H4 = getChar(cal3, 3);
    dig_H4 = (dig_H4 << 24) >> 20;
    dig_H4 = dig_H4 | (getChar(cal3, 4) & 0x0f);

    let dig_H5 = getChar(cal3, 5);
    dig_H5 = (dig_H5 << 24) >> 20;
    dig_H5 = dig_H5 | ((getUChar(cal3, 4) >> 4) & 0x0f);

    const var1 = t_fine - 76800.0;
    const var2 = (dig_H4 * 64.0 + ((dig_H5) / 16384.0) * var1);
    const var3 = adc_H - var2;
    const var4 = (dig_H2) / 65536.0;
    const var5 = (1.0 + ((dig_H3) / 67108864.0) * var1);
    let var6 = 1.0 + ((dig_H6) / 67108864.0) * var1 * var5;
    var6 = var3 * var4 * (var5 * var6);
    const humidity = var6 * (1.0 - dig_H1 * var6 / 524288.0);

    if (humidity > 100) {
      return 100;
    } else if (humidity < 0) {
      return 0;
    } else {
      return humidity;
    }
  }

  readonly _defaultData: Reading = {} as Reading;
  readonly _address: number = BMP280_ADDR;
  readonly _i2cOptions: I2COptions;

  constructor(options?: any, i2c1?: I2CBusP) {
    this._i2cOptions =
      (options?.I2C as I2COptions) ??
      ({
        address: BMP280_ADDR,
        busNumber: 1,
        sampleInterval: SAMPLE_INTERVAL_DEFAULT
      } as I2COptions);

    this._defaultData = options?.defaultData ?? ({} as Reading);
    this._address = this._i2cOptions.address;

    if (i2c1) {
      this.i2c1 = i2c1;
    } else {
      this.open(this._i2cOptions.busNumber);
    }
  }

  public get I2C1(): I2CBusP {
    return this.i2c1;
  }

  public set I2C1(v: I2CBusP) {
    this.i2c1 = v;
  }

  public async open(busNumber: number): Promise<void> {
    if (!this.i2c1) {
      this.i2c1 = await I2CBusOpen(busNumber);
    }

    WLogger.info(
      `IC2 bus is ${this.i2c1 ? 'Open' : 'Closed'}, address is ${this._address}`
    );

    try {
      await this.getChipID(); // test if device is active and ready
    } catch (error) {
      WLogger.error('Device is not ready', error);
      throw error;
    }
  }

  public async read(): Promise<Reading> {
    return this.readSamples(8, 1);
  }

  private async readSamples(n: number, skip: number): Promise<Reading> {
    let samples: Reading[] = [];
    for (let i = 0; i < n; i++) {
      samples.push(await this.getReading());
    }

    samples = samples.slice(skip, n - 1);
    const t = rounded(mean(samples.map(m => m.temperature)), 2);
    const p = rounded(mean(samples.map(m => m.pressure)), 0);
    const h = rounded(samples[0].humidity, 1);

    const reading = samples[samples.length - 1];

    return {
      ...reading,
      temperature: t,
      pressure: p,
      humidity: h
    };
  }

  public write(data: any): void {
    WLogger.info(`data:${data}`);
    throw new Error('Not implemented');
  }

  public close(): void {
    this.i2c1?.close();
  }

  private async getChipID(): Promise<number> {
    const BME280_REGISTER_CHIPID = 0xD0;

    const data = Buffer.alloc(1);
    await this.i2c1?.readI2cBlock(this._address, BME280_REGISTER_CHIPID, 1, data);
    return data.readUInt8(0);
  }

  public async getReading(): Promise<Reading> {
    // Register Addresses
    const REG_DATA = 0xf7;
    const STANDBY_TIME = 7;
    const REG_CONTROL = 0xf4;
    const FILTER = 0;

    const REG_CONTROL_HUM = 0xf2;

    // # Oversample setting - page 27
    const OVERSAMPLE_TEMP = 4;
    const OVERSAMPLE_PRES = 4;
    const MODE = 1;

    if (!this.i2c1) {
      this.open(this._i2cOptions.busNumber);
    }

    // # Oversample setting for humidity register - page 26
    const OVERSAMPLE_HUM = 2;
    await this.i2c1?.writeByte(this._address, REG_CONTROL_HUM, OVERSAMPLE_HUM);

    const control = (OVERSAMPLE_TEMP << 5) | (OVERSAMPLE_PRES << 2) | MODE;
    await this.i2c1?.writeByte(this._address, REG_CONTROL, control);

    await this.setSampling(MODE, OVERSAMPLE_TEMP, OVERSAMPLE_PRES);
    await this.setConfig(STANDBY_TIME, FILTER, 0);

    // # Read blocks of calibration data from EEPROM
    // # See Page 22 data sheet
    const cal1 = Buffer.alloc(24);
    const cal2 = Buffer.alloc(1);
    const cal3 = Buffer.alloc(7);

    await this.i2c1?.readI2cBlock(this._address, 0x88, 24, cal1);
    await this.i2c1?.readI2cBlock(this._address, 0xa1, 1, cal2);
    await this.i2c1?.readI2cBlock(this._address, 0xe1, 7, cal3);

    const wait_time =
      1.25 +
      2.3 * OVERSAMPLE_TEMP +
      (2.3 * OVERSAMPLE_PRES + 0.575) +
      (2.3 * OVERSAMPLE_HUM + 0.575) + 10;
    await delay(wait_time); // # Wait the required time

    // # Read temperature/pressure/humidity

    const data = Buffer.alloc(8);
    await this.i2c1?.readI2cBlock(this._address, REG_DATA, 8, data);

    const adc_P = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
    const adc_T = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
    const adc_H = (data[6] << 8) | data[7];

    const t_fine = this.getTFine(adc_T, cal1);

    const temperature = this.compensateTemperature(t_fine) + cKelvinOffset;
    const pressure = this.compensatePressure(adc_P, cal1, t_fine);
    const humidity = this.compensateHumidity(adc_H, cal2, cal3, t_fine);

    const reading = {
      ts: new Date().valueOf(),
      temperature: temperature,
      humidity: humidity,
      pressure: pressure,
      device: 'BME280'
    } as Reading;

    return reading;
  }

  private async setSampling(
    mode: number,
    tempSampling: number,
    pressSampling: number
  ): Promise<void> {
    const REG_CONTROL = 0xf4;

    const control = (tempSampling << 5) | (pressSampling << 2) | mode;

    await this.i2c1?.writeByte(this._address, REG_CONTROL, control);
  }

  private async setConfig(
    t_sb: number,
    filter: number,
    spi3w_en: number
  ): Promise<void> {
    const REG_CONTROL_CONFIG = 0xf5;

    const control = (t_sb << 5) | (filter << 2) | spi3w_en;

    await this.i2c1?.writeByte(this._address, REG_CONTROL_CONFIG, control);
  }
}

const getUShort = (data: Buffer, index: number): number => {
  return data.readUInt16LE(index);
  // return (data[index + 1] << 8 | data[index]) / 256;
};

const getShort = (data: Buffer, index: number): number => {
  return data.readInt16LE(index);
  //return (getUShort(data, index) << 16) >> 16;
};

const getChar = (data: Buffer, index: number): number => {
  return data.readInt8(index);
  // const v = data[index];
  // return (v > 127 ? v - 256 : v); // 0xFF;
};

const getUChar = (data: Buffer, index: number): number => {
  return data.readUInt8(index);
  //return data[index]; // 0xFF;
};


const mean = (arr: number[]): number => {
  const sum = arr.reduce((a, b) => a + b);
  return sum / arr.length;
}
