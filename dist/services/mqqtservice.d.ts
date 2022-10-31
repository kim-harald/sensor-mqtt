import { Observable } from "rxjs";
import { Reading } from "../models/reading";
export declare type ReadingType = 'temperature' | 'pressure' | 'humidity' | 'all';
export declare const MqqtService: {
    init: (brokerUri: string, topic: string, username: string, password: string) => Promise<void>;
    send: (readingType: ReadingType, data: number | Reading) => Promise<boolean>;
    close: () => Promise<void>;
    subscribeTopic: (readingType: ReadingType) => Observable<number | Reading>;
};
//# sourceMappingURL=mqqtservice.d.ts.map