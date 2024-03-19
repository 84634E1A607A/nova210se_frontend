/**
 * @description Asserts for data types when useing react-router's loader and react-query together.
 * The function names are exactly the types asserted to be.
 */

import { Friend, Group, Invitation } from './types';

export function assertIsFriendsGroupsData(
  data: unknown,
): asserts data is { friends: Friend[]; groups: Group[] } {
  if (!(typeof data === 'object')) throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('friends' in data)) throw new Error('Server response does not contain friends');
  if (!('groups' in data)) throw new Error('Server response does not contain groups');
}

export function assertIsInvitationsData(
  data: unknown,
): asserts data is { invitaions: Invitation[] } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('invitaions' in data)) throw new Error('Server response does not contain invitaions');
}
