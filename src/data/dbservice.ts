import { Doc } from './doc';
import { promises as pfs } from 'fs';
import path from 'path';
import fs from 'fs';
import { WLogger } from '../services/loggerservice';
import { v4 as uuid } from 'uuid';

let _data: Doc<unknown>[] = [];
let _isBusy = false;
let _isReady = false;
let _isDirty = false;
let _intervalHandle: NodeJS.Timeout;
let _path: string;

const init = async (path: string, interval: number): Promise<void> => {
  _path = path;
  _intervalHandle = setInterval(() => {
    write(true);
  }, interval);

  await read();
};

const get = async (id: unknown): Promise<Doc<unknown> | null | undefined> => {
  if (!_isReady) throw new Error('Database is not ready');

  const entity = _data.find((o) => o.id === id);

  return entity;
};

const getAll = async (): Promise<Doc<unknown>[]> => {
  if (!_isReady) throw new Error('Database is not ready');

  return _data;
};

const save = async (entity: Doc<unknown>): Promise<Doc<unknown> | null> => {
  if (!_isReady) throw new Error('Database is not ready');

  _isBusy = true;
  let id = entity.id ?? nextId();
  const index = _data.findIndex((o) => o.id === id);
  if (index < 0) {
    _data.push(entity);
  } else {
    _data[index] = entity;
  }

  _isBusy = false;
  _isDirty = true;
  return entity;
};

const saveAll = async (entities: Doc<unknown>[]): Promise<Doc<unknown>[]> => {
  if (!_isReady) {
    throw new Error('Database is not ready');
  }

  for (const entity of entities) {
    await save(entity);

    _isBusy = false;
    _isDirty = true;
  }

  return entities;
};

const remove = async (deleteIds: unknown | unknown[]): Promise<void> => {
  let ids: unknown[] = [];

  if (!Array.isArray(deleteIds)) {
    ids.push(deleteIds);
  } else {
    ids = deleteIds;
  }

  _isBusy = true;
  for (const deleteId of ids) {
    const index = _data.findIndex((o) => o.id === deleteId);
    if (index > -1) {
      _data.splice(index, 1);
    }
  }

  _isBusy = false;
  _isDirty = true;
};

const read = async (): Promise<void> => {
  if (_isBusy) {
    throw new Error('Database is busy - unable to read');
  }

  if (_isDirty) {
    throw new Error('Database is dirty - unable to read');
  }

  try {
    const q = await pfs.readFile(_path);
    const json = q.toString();
    _data = JSON.parse(json);
  } catch (error) {
    _data = [];
    write(true);
  }
  _isReady = true;
};

const write = async (isForce = false): Promise<void> => {
  if (isForce || (_isDirty && !_isBusy && _isReady)) {
    try {
      if (!fs.existsSync(_path)) {
        const d = path.dirname(_path);
        if (!fs.existsSync(d)) {
          fs.mkdirSync(d);
        }
      }
      await pfs.writeFile(_path, JSON.stringify(_data));
      _isDirty = false;
    } catch (error) {
      WLogger.error(error);
    }
  }
};

const close = async (): Promise<void> => {
  clearInterval(_intervalHandle);
  await write();
  _isBusy = false;
};

const nextId = (): string => {
  return uuid().toString();
};

export const Db = {
  init,
  close,
  save,
  saveAll,
  get,
  getAll,
  remove,
};
