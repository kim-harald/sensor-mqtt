import { PromisifiedBus } from 'i2c-bus';
import { Reading } from "../models/reading";
export declare const SensorService: {
    init: (i2cBus: PromisifiedBus, deviceId: string, config: any) => Promise<void>;
    read: () => Promise<Reading>;
    close: () => void;
};
//# sourceMappingURL=sensorservice.d.ts.map