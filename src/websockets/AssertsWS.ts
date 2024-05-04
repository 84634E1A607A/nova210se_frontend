import { S2CMessage } from './WSTypes';

export function assertIsS2CMessage(data: unknown): asserts data is S2CMessage {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid S2C message');
  }
  if (!('action' in data)) {
    throw new Error('Invalid S2C message');
  }
  if (typeof data.action !== 'string') {
    throw new Error('Invalid S2C message');
  }
  if (!('data' in data)) {
    throw new Error('Invalid S2C message');
  }
  if (!('ok' in data)) {
    throw new Error('Invalid S2C message');
  }
  if (typeof data.ok !== 'boolean') {
    throw new Error('Invalid S2C message');
  }
}
