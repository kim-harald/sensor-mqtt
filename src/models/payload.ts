import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import SparkMD5 from 'spark-md5';
import { Reading } from './reading';

export class Payload {
  /**
   * Array of Reading entries
   */
  public data: Reading[];

  /**
   * Hash of data for integrity purposes
   */
  public hash: string;
  constructor(data: Reading[]) {
    this.data = data;
    this.hash = '';
    this.setHash();
  }

  private computeHash(): string {
    return SparkMD5.hash(this.getDataForHash());
  }

  public setHash(): void {
    this.hash = this.computeHash();
  }

  public get isValid(): Observable<boolean> {
    return from(SparkMD5.hash(this.getDataForHash())).pipe(
      map((m) => {
        return m === this.hash;
      })
    );
  }

  private getDataForHash(): string {
    const s = this.data
      .map(
        (m) =>
          m.ts.toString() +
          m.temperature?.toString() +
          m.humidity?.toString() +
          m.pressure?.toString()
      )
      .reduce((a, b) => a + b, '');

    return s;
  }
}
