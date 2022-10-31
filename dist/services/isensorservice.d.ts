import { Reading } from '../models/reading';
export interface ISensorService {
    read(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    open(options?: unknown): Promise<void>;
}
export interface I2COptions {
    busNumber: number;
    address: number;
    sampleInterval: number;
    sampleSchedule: string;
}
//# sourceMappingURL=isensorservice.d.ts.map