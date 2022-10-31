"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosSummaryError = exports.Axios = void 0;
const rxjs_1 = require("rxjs");
const axios_1 = __importDefault(require("axios"));
const loggerservice_1 = require("./loggerservice");
class Axios {
    static get(url, agent) {
        loggerservice_1.WLogger.debug(`Axios.get(${url})`);
        return new rxjs_1.Observable((s) => {
            axios_1.default.get(url, { httpsAgent: agent }).then((response) => {
                if (response.status < 400) {
                    loggerservice_1.WLogger.debug(`Axios.get : success`);
                    s.next(response);
                    s.complete();
                }
                else {
                    s.error(response);
                    loggerservice_1.WLogger.debug(`Axios.get : failure code(${response.status})`);
                    s.complete();
                }
            }).catch((reason) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }
    static post(url, data, agent) {
        loggerservice_1.WLogger.debug(`Axios.post(${url},${JSON.stringify(data)})`);
        return new rxjs_1.Observable(s => {
            axios_1.default.post(url, data, { httpsAgent: agent }).then((response) => {
                if (response.status < 400) {
                    loggerservice_1.WLogger.debug(`Axios.post : success`);
                    s.next(response);
                    s.complete();
                }
                else {
                    s.error(response);
                    s.complete();
                }
            }).catch((reason) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }
    static put(url, data, agent) {
        loggerservice_1.WLogger.debug(`Axios.put(${url},${JSON.stringify(data)})`);
        return new rxjs_1.Observable(s => {
            axios_1.default.put(url, data, { httpsAgent: agent }).then((response) => {
                if (response.status < 400) {
                    loggerservice_1.WLogger.debug(`Axios.put : success`);
                    s.next(response);
                    s.complete();
                }
                else {
                    s.error(response);
                    s.complete();
                }
            }).catch((reason) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }
    static delete(url, agent) {
        loggerservice_1.WLogger.debug(`Axios.delete(${url})`);
        return new rxjs_1.Observable(s => {
            axios_1.default.delete(url, { httpsAgent: agent }).then((response) => {
                if (response.status < 400) {
                    loggerservice_1.WLogger.debug(`Axios.delete : success`);
                    s.next(response);
                    s.complete();
                }
                else {
                    loggerservice_1.WLogger.debug(`Axios.delete : failure (${response.status})`);
                    s.error(response);
                    s.complete();
                }
            }).catch((reason) => {
                s.error(this.trimError(reason));
                s.complete();
            });
        });
    }
    static trimError(reason) {
        var _a, _b;
        return {
            type: 'Severe Axios error',
            url: reason.config.url,
            verb: reason.request.method,
            response: {
                status: (_a = reason.response) === null || _a === void 0 ? void 0 : _a.status,
                statusText: (_b = reason.response) === null || _b === void 0 ? void 0 : _b.statusText
            }
        };
    }
}
exports.Axios = Axios;
class AxiosSummaryError {
}
exports.AxiosSummaryError = AxiosSummaryError;
//# sourceMappingURL=axiosobservable.js.map