import { Db } from '../data/dbservice';
import { Doc } from '../data/doc';
import { WLogger } from './loggerservice';
import { Payload, Reading } from '../models';
import axios from 'axios';
import config from '../config/default.json';
import { hostname } from 'os';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

export const SyncService = {
  execute: async (): Promise<void> => {
    try {
      WLogger.info('Syncing data');
      const readings = (await Db.getAll()).map((o) => {
        const r = o as Doc<Reading>;
        r.location = hostname();
        return r;
      });
      let page = 1;
      const pageSize = 100;
      let slice = paginate(readings, pageSize, page);
      while (slice.length > 0) {
        const payload = new Payload(slice);
        if (!payload.isValid) {
          throw new Error('Invalid payload hash');
        }
        const response = await axios.put(config.PayloadUrl, payload, {
          httpsAgent: agent,
        });
        if (![200, 204].includes(response.status)) {
          throw new Error(`Invalid response ${response.status}. ${response.data}`);
        }

        WLogger.debug(`Syncing response ${response.status} ${slice.length * page}/${readings.length}`);

        page++;
        slice = paginate(readings, pageSize, page);
      }
      WLogger.info('Syncing data complete');
    } catch (error) {
      WLogger.error(error);
    }
  },
};

const paginate = <T>(array: T[], pageSize: number, pageNumber: number): T[] => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
