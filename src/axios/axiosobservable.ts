import { Observable, Subscriber } from 'rxjs';
import https from 'https';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { WLogger } from '../services/loggerservice';


export class Axios {

    public static get(url: string, agent?: https.Agent): Observable<AxiosResponse> {
        WLogger.debug(`Axios.get(${url})`);
        return new Observable<AxiosResponse>((s: Subscriber<AxiosResponse>) => {
            axios.get(url, { httpsAgent: agent }).then((response: AxiosResponse) => {
                if (response.status < 400) {
                    WLogger.debug(`Axios.get : success`);
                    s.next(response);
                    s.complete();
                } else {
                    s.error(response);
                    WLogger.debug(`Axios.get : failure code(${response.status})`);
                    s.complete();
                }
            }).catch((reason: AxiosError) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }

    public static post(url: string, data: unknown, agent?: https.Agent): Observable<AxiosResponse> {
        WLogger.debug(`Axios.post(${url},${JSON.stringify(data)})`);
        return new Observable<AxiosResponse>(s => {
            axios.post(url, data, { httpsAgent: agent }).then((response: AxiosResponse) => {
                if (response.status < 400) {
                    WLogger.debug(`Axios.post : success`);
                    s.next(response);
                    s.complete();
                } else {
                    s.error(response);
                    s.complete();
                }
            }).catch((reason: AxiosError) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }

    public static put(url: string, data: unknown, agent?: https.Agent): Observable<AxiosResponse> {
        WLogger.debug(`Axios.put(${url},${JSON.stringify(data)})`);
        return new Observable<AxiosResponse>(s => {
            axios.put(url, data, { httpsAgent: agent }).then((response: AxiosResponse) => {
                if (response.status < 400) {
                    WLogger.debug(`Axios.put : success`);
                    s.next(response);
                    s.complete();
                } else {
                    s.error(response);
                    s.complete();
                }
            }).catch((reason: AxiosError) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }

    public static delete(url: string, agent?: https.Agent): Observable<AxiosResponse> {
        WLogger.debug(`Axios.delete(${url})`);
        return new Observable<AxiosResponse>(s => {
            axios.delete(url, { httpsAgent: agent }).then((response: AxiosResponse) => {
                if (response.status < 400) {
                    WLogger.debug(`Axios.delete : success`);
                    s.next(response);
                    s.complete();
                } else {
                    WLogger.debug(`Axios.delete : failure (${response.status})`)
                    s.error(response);
                    s.complete();
                }
            }).catch((reason: AxiosError) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }

    private static trimError = (reason: AxiosError): AxiosSummaryError => {
        return {
            type: 'Severe Axios error',
            url: reason.config?.url,
            verb: reason.request.method,
            response: {
                status: reason.response?.status,
                statusText: reason.response?.statusText
            }
        } as AxiosSummaryError;
    }
}

export class AxiosSummaryError {
    type!: string;
    url!: AxiosRequestConfig;
    response!: {
        statusText?: string,
        status?: number
    }
}




