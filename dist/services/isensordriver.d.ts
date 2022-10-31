import { Reading } from '../models/reading';
export interface ISensorDriver {
    read(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    open(options?: unknown): Promise<void>;
}
export declare type I2COptions = {
    busNumber: number;
    address: number;
    sampleInterval: number;
    sampleSchedule: string;
};
//# sourceMappingURL=isensordriver.d.ts.map