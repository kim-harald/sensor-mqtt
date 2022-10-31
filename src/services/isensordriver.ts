import { Observable } from 'rxjs';
import { Reading } from '../models/reading';

export interface ISensorDriver {
    read(): Promise<Reading>;
    write(data: unknown): void;
    close(): void;
    open(options?: unknown): Promise<void>;
}

export type I2COptions = {
    busNumber: number,
    address: number,
    sampleInterval: number,
    sampleSchedule: string,
}
