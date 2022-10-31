import { Reading } from '../models/reading';
import { ISensorDriver } from './isensordriver';
export declare class SensorTestService implements ISensorDriver {
    private i2c1;
    private GET_TEMP_CMD;
    private _address;
    private _defaultData;
    constructor(options: any | undefined);
    open(options: any | undefined): Promise<void>;
    read(): Promise<Reading>;
    readAsync(): Promise<Reading>;
    private getRandomSample;
    write(data: any): void;
    close(): void;
    scan(): Promise<number[]>;
}
//# sourceMappingURL=sensortestservice.d.ts.map