import { S2CMessage, S2CMessageError } from './WSTypes';

function assertIsS2CMessageError(data: object): asserts data is S2CMessageError {
  if (!('code' in data)) {
    throw new Error('Invalid S2C message error');
  }
  if (typeof data.code !== 'number') {
    throw new Error('Invalid S2C message error');
  }
  if (!('error' in data)) {
    throw new Error('Invalid S2C message error');
  }
  if (typeof data.error !== 'string') {
    throw new Error('Invalid S2C message error');
  }
}

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
  if (!('ok' in data)) {
    throw new Error('Invalid S2C message');
  }
  if (typeof data.ok !== 'boolean') {
    throw new Error('Invalid S2C message');
  }
  try {
    if (!('data' in data)) {
      throw new Error('Invalid S2C message');
    }
  } catch (e) {
    assertIsS2CMessageError(data);
  }
}
