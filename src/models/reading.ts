export type Reading = {
  id?: unknown;
  ts: number;
  temperature: number;
  pressure: number;
  humidity: number;
  device?: string;
  location?: string;
};
