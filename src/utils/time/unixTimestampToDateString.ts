export function unixTimestampToDateString(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, '0');
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][date.getMonth()];
  const year = date.getFullYear();

  return `${day}_${month}_${year}`;
}
