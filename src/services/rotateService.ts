import { Db } from '../data/dbservice';
import { Doc } from '../data/doc';
import { Reading } from '../models/reading';

export const rotate = async (
  reading: Reading,
  threshold: number,
): Promise<void> => {
  const doc: Doc<Reading> = reading as Doc<Reading>;
  // doc.id = doc.ts;
  Db.save(doc);
  const readings = (await Db.getAll()).map((o) => o as Doc<Reading>);
  const ids = readings
    .filter((o) => {
      o.ts < new Date().valueOf() - threshold;
    })
    .map((m) => m.id);
  Db.remove(ids);
};
