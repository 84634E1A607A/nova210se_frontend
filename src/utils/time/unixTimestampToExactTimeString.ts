import { unixTimestampToDateString } from './unixTimestampToDateString';
import { unixTimestampToClockString } from './unixTimestampToClockString';

export function unixTimestampToExactTimeString(unixTimestamp: number): string {
  return unixTimestampToDateString(unixTimestamp) + ' ' + unixTimestampToClockString(unixTimestamp);
}
