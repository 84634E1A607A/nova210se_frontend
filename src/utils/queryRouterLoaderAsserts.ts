/**
 * @description Asserts for data types when useing react-router's loader and react-query together.
 * The function names are exactly the types asserted to be. They all have data as suffix.
 */

import { ChatRelatedWithCurrentUser, Friend, Group, Invitation, LeastUserInfo } from './types';

export function assertIsFriendsData(data: unknown): asserts data is { friends: Friend[] } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('friends' in data)) throw new Error('Server response does not contain friends');
}

export function assertIsFriendsGroupsData(
  data: unknown,
): asserts data is { friends: Friend[]; groups: Group[] } {
  assertIsFriendsData(data);
  if (!('groups' in data)) throw new Error('Server response does not contain groups');
}

export function assertIsInvitationsData(
  data: unknown,
): asserts data is { invitaions: Invitation[] } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('invitaions' in data)) throw new Error('Server response does not contain invitaions');
}

export function assertIsUserData(data: unknown): asserts data is { user: LeastUserInfo } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('user' in data)) throw new Error('Server response does not contain user');
}

export function assertIsChatsRelatedWithCurrentUserData(
  data: unknown,
): asserts data is { chatsRelatedWithCurrentUser: ChatRelatedWithCurrentUser[] } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('chatsRelatedWithCurrentUser' in data))
    throw new Error('Server response does not contain chatsRelatedWithCurrentUser');
}

export function assertIsFriendsAndChatsRelatedWithCurrentUserData(data: unknown): asserts data is {
  friends: Friend[];
  chatsRelatedWithCurrentUser: ChatRelatedWithCurrentUser[];
} {
  assertIsFriendsData(data);
  assertIsChatsRelatedWithCurrentUserData(data);
}

export function assertIsUserAndFriendsData(data: unknown): asserts data is {
  user: LeastUserInfo;
  friends: Friend[];
} {
  assertIsUserData(data);
  assertIsFriendsData(data);
}
