import { PromisifiedBus as I2CBusP } from 'i2c-bus';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
export declare class ATH10 implements ISensorDriver {
    private i2c1;
    readonly _defaultData: Reading;
    readonly _address: number;
    readonly _i2cOptions: I2COptions;
    constructor(options?: any, i2c1?: I2CBusP);
    read(): Promise<Reading>;
    getReading(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    open(busNumber: number): Promise<void>;
    private initCmd;
}
//# sourceMappingURL=aht10.d.ts.map