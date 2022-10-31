import { PromisifiedBus as I2CBusP } from 'i2c-bus';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
export declare class BMX280 implements ISensorDriver {
    private i2c1;
    private getTFine;
    private compensateTemperature;
    private compensatePressure;
    private compensateHumidityPy;
    private compensateHumidity;
    readonly _defaultData: Reading;
    readonly _address: number;
    readonly _i2cOptions: I2COptions;
    constructor(options?: any, i2c1?: I2CBusP);
    get I2C1(): I2CBusP;
    set I2C1(v: I2CBusP);
    open(busNumber: number): Promise<void>;
    read(): Promise<Reading>;
    private readSamples;
    write(data: any): void;
    close(): void;
    private getChipID;
    getReading(): Promise<Reading>;
    private setSampling;
    private setConfig;
}
//# sourceMappingURL=BMX280.d.ts.map