export function unixTimestampToClockString(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}`;
}
