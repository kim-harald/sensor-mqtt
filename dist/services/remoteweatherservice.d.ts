import { Reading } from '../models/reading';
import { ISensorDriver } from './isensordriver';
export declare class RemoteWeather implements ISensorDriver {
    readonly _url = "https://api.openweathermap.org/data/2.5/weather?q=Ranheim&appid=c8bc47495f2a596286dd0f523e1921aa";
    readonly _sampleInterval: number;
    constructor(options: any | undefined);
    open(options?: any): Promise<void>;
    read(): Promise<Reading>;
    private httpRead;
    scan(): Promise<number[]>;
    write(_data: any): void;
    close(): void;
}
//# sourceMappingURL=remoteweatherservice.d.ts.map