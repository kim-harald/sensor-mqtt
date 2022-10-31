import { PromisifiedBus } from 'i2c-bus';
import { Reading } from "../models/reading";
export declare const DeviceService: {
    init: (deviceId: string, bus: PromisifiedBus) => Promise<void>;
    read: (deviceId: string) => Promise<Reading>;
    close: (deviceId: string) => void;
};
//# sourceMappingURL=deviceservice.d.ts.map