import { Friend, Group, Invitation, InvitationSourceType } from './types';
import { LeastUserInfo } from './types';

export function assertIsLeastUserInfo(userInfo: unknown): asserts userInfo is LeastUserInfo {
  if (userInfo === null) throw new Error('Server response is null');
  if (typeof userInfo !== 'object') throw new Error('Server response is not an object');
  if (!('id' in userInfo)) throw new Error('Server response does not contain id');
  if (typeof userInfo.id !== 'number') throw new Error('Server response id is not a number');
  if (!('user_name' in userInfo)) throw new Error('Server response does not contain user_name');
  if (typeof userInfo.user_name !== 'string')
    throw new Error('Server response user_name is not a string');
  if (!('avatar' in userInfo)) throw new Error('Server response does not contain avatar');
  if (typeof userInfo.avatar !== 'string')
    throw new Error('Server response avatar is not a string');
}

export function assertIsGroup(group: unknown): asserts group is Group {
  if (typeof group !== 'object') throw new Error('Server response is not an object');
  if (group === null) throw new Error('Server response is null');
  if (!('group_id' in group)) throw new Error('Server response does not contain group_id');
  if (typeof group.group_id !== 'number')
    throw new Error('Server response group_id is not a number');
  if (!('group_name' in group)) throw new Error('Server response does not contain group_name');
  if (typeof group.group_name !== 'string')
    throw new Error('Server response group_name is not a string');
}

export function assertIsGroupsList(data: unknown): asserts data is Group[] {
  if (!Array.isArray(data)) throw new Error('Server response is not an array');
  for (const group of data) assertIsGroup(group);
}

export function assertIsFriend(friend: unknown): asserts friend is Friend {
  if (typeof friend !== 'object') throw new Error('Server response is not an object');
  if (friend === null) throw new Error('Server response is null');
  if (!('friend' in friend)) throw new Error('Server response does not contain friend');
  assertIsLeastUserInfo(friend.friend);
  if (!('nickname' in friend)) throw new Error('Server response does not contain nickname');
  if (typeof friend.nickname !== 'string')
    throw new Error('Server response nickname is not a string');
  if (!('group' in friend)) throw new Error('Server response does not contain group');
  assertIsGroup(friend.group);
}

export function assertIsFriendsList(friendsList: unknown): asserts friendsList is Friend[] {
  if (!Array.isArray(friendsList)) throw new Error('Server response is not an array');
  for (const friend of friendsList) assertIsFriend(friend);
}

export function assertIsFriendsListData(data: unknown): asserts data is { friends: Friend[] } {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('body' in data)) throw new Error('Server response does not contain body');
  assertIsFriendsList(data.body);
}

export function assertIsInvitationList(
  invitationList: unknown,
): asserts invitationList is Invitation[] {
  if (!Array.isArray(invitationList)) throw new Error('Not a list');
  for (const invitation of invitationList) {
    if (!('id' in invitation)) throw new Error('Missing id');
    if (!('comment' in invitation)) throw new Error('Missing comment');
    if (!('sender' in invitation)) throw new Error('Missing sender');
    if (!('source' in invitation)) throw new Error('Missing source');
    if (typeof invitation.id !== 'number') throw new Error('id is not a number');
    if (typeof invitation.comment !== 'string') throw new Error('comment is not a string');
    if (typeof invitation.sender !== 'string') throw new Error('sender is not a string');
    if (invitation.source !== 'search' && typeof invitation.source !== 'number')
      throw new Error('source is not valid');
  }
}

export function assertIsInvitationSourceType(
  source: unknown,
): asserts source is InvitationSourceType {
  if (source !== 'search' && typeof source !== 'number') throw new Error('source is not valid');
}
