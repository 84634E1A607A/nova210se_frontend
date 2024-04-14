import { Friend } from '../../utils/types';

/**
 * @description Get the name to display of a friend. If the friend has a nickname, return the nickname, otherwise return the username.
 */
export function parseNameOfFriend(friend: Friend) {
  return friend.nickname !== '' ? friend.nickname : friend.friend.user_name;
}
