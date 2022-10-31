/// <reference types="node" />
import { Observable } from 'rxjs';
import https from 'https';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare class Axios {
    static get(url: string, agent?: https.Agent): Observable<AxiosResponse>;
    static post(url: string, data: unknown, agent?: https.Agent): Observable<AxiosResponse>;
    static put(url: string, data: unknown, agent?: https.Agent): Observable<AxiosResponse>;
    static delete(url: string, agent?: https.Agent): Observable<AxiosResponse>;
    private static trimError;
}
export declare class AxiosSummaryError {
    type: string;
    url: AxiosRequestConfig;
    response: {
        statusText?: string;
        status?: number;
    };
}
//# sourceMappingURL=axiosobservable.d.ts.map