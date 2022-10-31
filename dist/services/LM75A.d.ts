import { PromisifiedBus as I2CBusP } from 'i2c-bus';
import { Observable } from 'rxjs';
import { Reading } from '../models/reading';
import { I2COptions, ISensorDriver } from './isensordriver';
export declare class LM75A implements ISensorDriver {
    private i2c1;
    readonly GET_TEMP_CMD = 1;
    private _sampleInterval;
    private _address;
    readonly _defaultData: Reading;
    readonly _i2cOptions: I2COptions;
    constructor(options: any | undefined, i2c1?: I2CBusP);
    get I2C1(): I2CBusP | undefined;
    open(busNumber: number): Promise<void>;
    scan(): Observable<number[]>;
    read(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    private getReading;
    private decodeTemp;
}
//# sourceMappingURL=LM75A.d.ts.map