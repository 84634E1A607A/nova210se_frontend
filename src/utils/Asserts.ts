import {
  Chat,
  ChatRelatedWithCurrentUser,
  DetailedMessage,
  Friend,
  Group,
  Invitation,
  InvitationSourceType,
  Message,
  ApplicationForChat,
} from './Types';
import { LeastUserInfo } from './Types';

export function assertIsLeastUserInfo(userInfo: unknown): asserts userInfo is LeastUserInfo {
  if (userInfo === null) throw new Error('Server response is null');
  if (typeof userInfo !== 'object') throw new Error('Server response is not an object');
  if (!('id' in userInfo)) throw new Error('Server response does not contain id');
  if (typeof userInfo.id !== 'number') throw new Error('Server response id is not a number');
  if (!('user_name' in userInfo)) throw new Error('Server response does not contain user_name');
  if (typeof userInfo.user_name !== 'string')
    throw new Error('Server response user_name is not a string');
  if (!('avatar_url' in userInfo)) throw new Error('Server response does not contain avatar_url');
  if (typeof userInfo.avatar_url !== 'string')
    throw new Error('Server response avatar_url is not a string');
}

export function assertIsLeastUserInfoList(body: unknown): asserts body is LeastUserInfo[] {
  if (!Array.isArray(body)) throw new Error('Server response is not an array');
  for (const userInfo of body) assertIsLeastUserInfo(userInfo);
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
  if (data === undefined) throw new Error('Server response is undefined');
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('friends' in data)) throw new Error("Server response does not contain ' friends ' body");
  assertIsFriendsList(data.friends);
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
    assertIsLeastUserInfo(invitation.sender);
    if (invitation.source !== 'search' && typeof invitation.source !== 'number')
      throw new Error('source is not valid');
  }
}

export function assertIsInvitationSourceType(
  source: unknown,
): asserts source is InvitationSourceType {
  if (source !== 'search' && typeof source !== 'number') throw new Error('source is not valid');
}

export function assertIsNumber(data: unknown): asserts data is number {
  if (typeof data !== 'number') throw new Error('Not a number');
}

export function assertIsApiError(error: unknown): asserts error is { error: string } {
  if (typeof error !== 'object') throw new Error('Not an object');
  if (error === null) throw new Error('Null');
  if (!('error' in error)) throw new Error('Missing error');
  if (typeof error.error !== 'string') throw new Error('error is not a string');
}

export function assertIsMessage(data: unknown): asserts data is Message {
  if (typeof data !== 'object') throw new Error('Not an object');
  if (data === null) throw new Error('Null');
  if (!('message_id' in data)) throw new Error('Missing message_id');
  if (typeof data.message_id !== 'number') throw new Error('message_id is not a number');
  if (!('chat_id' in data)) throw new Error('Missing chat_id');
  if (typeof data.chat_id !== 'number') throw new Error('chat_id is not a number');
  if (!('message' in data)) throw new Error('Missing message');
  if (typeof data.message !== 'string') throw new Error('message is not a string');
  if (!('send_time' in data)) throw new Error('Missing send_time');
  if (typeof data.send_time !== 'number') throw new Error('send_time is not a number');
  if (!('sender' in data)) throw new Error('Missing sender');
  assertIsLeastUserInfo(data.sender);
}
export function assertIsMessages(data: unknown): asserts data is Message[] {
  if (!Array.isArray(data)) throw new Error('Not an array');
  for (const message of data) assertIsMessage(message);
}

export function assertIsDetailedMessage(data: unknown): asserts data is DetailedMessage {
  assertIsMessage(data);
  if (!('reply_to' in data)) throw new Error('Missing reply_to');
  if (data.reply_to !== null) assertIsMessage(data.reply_to);
  if (!('read_users' in data)) throw new Error('Missing read_users');
  assertIsLeastUserInfoList(data.read_users);
  if (!('replied_by' in data)) throw new Error('Missing replied_by');
  assertIsMessages(data.replied_by);
}

export function assertIsDetailedMessages(data: unknown): asserts data is DetailedMessage[] {
  if (!Array.isArray(data)) throw new Error('Not an array');
  for (const message of data) assertIsDetailedMessage(message);
}

export function assertIsChat(data: unknown): asserts data is Chat {
  if (typeof data !== 'object') throw new Error('Not an object');
  if (data === null) throw new Error('Null');
  if (!('chat_id' in data)) throw new Error('Missing chat_id');
  if (typeof data.chat_id !== 'number') throw new Error('chat_id is not a number');
  if (!('chat_name' in data)) throw new Error('Missing chat_name');
  if (typeof data.chat_name !== 'string') throw new Error('chat_name is not a string');
  if (!('chat_owner' in data)) throw new Error('Missing chat_owner');
  assertIsLeastUserInfo(data.chat_owner);
  if (!('chat_admins' in data)) throw new Error('Missing chat_admins');
  assertIsLeastUserInfoList(data.chat_admins);
  if (!('chat_members' in data)) throw new Error('Missing chat_members');
  assertIsLeastUserInfoList(data.chat_members);
  if (!('last_message' in data)) throw new Error('Missing last_message');
  assertIsMessage(data.last_message);
}

export function assertIsChatRelatedWithCurrentUser(
  data: any,
): asserts data is ChatRelatedWithCurrentUser {
  if (typeof data !== 'object') throw new Error('Not an object');
  if (data === null) throw new Error('Null');
  if (!('chat' in data)) throw new Error('Missing chat');
  assertIsChat(data.chat);
  if (!('chat_id' in data)) data.chat_id = data.chat.chat_id; // copy the id for convenient use
  if (!('nickname' in data)) throw new Error('Missing nickname');
  if (typeof data.nickname !== 'string') throw new Error('nickname is not a string');
  if (!('unread_count' in data)) throw new Error('Missing unread_count');
  if (typeof data.unread_count !== 'number') throw new Error('unread_count is not a number');
  if ('chat_name' in data && typeof data.chat_name !== 'string')
    throw new Error('chat_name is not a string');
}

export function assertIsChatsRelatedWithCurrentUser(
  data: unknown,
): asserts data is ChatRelatedWithCurrentUser[] {
  if (!Array.isArray(data)) throw new Error('Not an array');
  for (const chat of data) assertIsChatRelatedWithCurrentUser(chat);
}

export function assertIsApplicationForChat(data: unknown): asserts data is ApplicationForChat {
  if (typeof data !== 'object') throw new Error('Not an object');
  if (data === null) throw new Error('Null');
  if (!('invitation_id' in data)) throw new Error('Missing invitation_id');
  if (typeof data.invitation_id !== 'number') throw new Error('invitation_id is not a number');
  if (!('chat_id' in data)) throw new Error('Missing chat_id');
  if (typeof data.chat_id !== 'number') throw new Error('chat_id is not a number');
  if (!('user' in data)) throw new Error('Missing user');
  assertIsLeastUserInfo(data.user);
  if (!('invited_by' in data)) throw new Error('Missing invited_by');
  assertIsLeastUserInfo(data.invited_by);
  if (!('created_at' in data)) throw new Error('Missing created_at');
  if (typeof data.created_at !== 'number') throw new Error('created_at is not a number');
}

export function assertIsApplicationsForChat(data: unknown): asserts data is ApplicationForChat[] {
  if (!Array.isArray(data)) throw new Error('Not an array');
  for (const application of data) assertIsApplicationForChat(application);
}
