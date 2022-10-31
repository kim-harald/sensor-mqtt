"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fs_2 = __importDefault(require("fs"));
const loggerservice_1 = require("../services/loggerservice");
const uuid_1 = require("uuid");
let _data = [];
let _isBusy = false;
let _isReady = false;
let _isDirty = false;
let _intervalHandle;
let _path;
const init = (path, interval) => __awaiter(void 0, void 0, void 0, function* () {
    _path = path;
    _intervalHandle = setInterval(() => {
        write(true);
    }, interval);
    yield read();
});
const get = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_isReady)
        throw new Error('Database is not ready');
    const entity = _data.find(o => o.id === id);
    return entity;
});
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!_isReady)
        throw new Error('Database is not ready');
    return (_data);
});
const save = (entity) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!_isReady)
        throw new Error('Database is not ready');
    _isBusy = true;
    let id = (_a = entity.id) !== null && _a !== void 0 ? _a : nextId();
    const index = _data.findIndex(o => o.id === id);
    if (index < 0) {
        _data.push(entity);
    }
    else {
        _data[index] = entity;
    }
    _isBusy = false;
    _isDirty = true;
    return entity;
});
const saveAll = (entities) => __awaiter(void 0, void 0, void 0, function* () {
    if (!_isReady) {
        throw new Error('Database is not ready');
    }
    for (const entity of entities) {
        yield save(entity);
        _isBusy = false;
        _isDirty = true;
    }
    return entities;
});
const remove = (deleteIds) => __awaiter(void 0, void 0, void 0, function* () {
    let ids = [];
    if (!Array.isArray(deleteIds)) {
        ids.push(deleteIds);
    }
    else {
        ids = deleteIds;
    }
    _isBusy = true;
    for (const deleteId of ids) {
        const index = _data.findIndex(o => o.id === deleteId);
        if (index > -1) {
            _data.splice(index, 1);
        }
    }
    _isBusy = false;
    _isDirty = true;
});
const read = () => __awaiter(void 0, void 0, void 0, function* () {
    if (_isBusy) {
        throw new Error('Database is busy - unable to read');
    }
    if (_isDirty) {
        throw new Error('Database is dirty - unable to read');
    }
    try {
        const q = yield fs_1.promises.readFile(_path);
        const json = q.toString();
        _data = JSON.parse(json);
    }
    catch (error) {
        _data = [];
        write(true);
    }
    _isReady = true;
});
const write = (isForce = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (isForce || (_isDirty && !_isBusy && _isReady)) {
        try {
            if (!fs_2.default.existsSync(_path)) {
                const d = path_1.default.dirname(_path);
                if (!fs_2.default.existsSync(d)) {
                    fs_2.default.mkdirSync(d);
                }
            }
            yield fs_1.promises.writeFile(_path, JSON.stringify(_data));
            _isDirty = false;
        }
        catch (error) {
            loggerservice_1.WLogger.info(error);
        }
    }
});
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    clearInterval(_intervalHandle);
    yield write();
    _isBusy = false;
});
const nextId = () => {
    return uuid_1.v4().toString();
};
exports.DbService = {
    init, close, save, saveAll, get, getAll, remove
};
//# sourceMappingURL=dbservice.js.map