import { Reading } from "../models/reading";
import { ISensorDriver } from "./isensordriver";
import { PromisifiedBus as I2CBusP } from 'i2c-bus';
export declare class AHT10_BMX280 implements ISensorDriver {
    private readonly i2c1;
    private readonly aht10;
    private readonly bmx280;
    constructor(aht10Options: any, bmx280Options: any, i2cbus: I2CBusP);
    read(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    open(options?: unknown): Promise<void>;
}
//# sourceMappingURL=aht10_bme280.d.ts.map