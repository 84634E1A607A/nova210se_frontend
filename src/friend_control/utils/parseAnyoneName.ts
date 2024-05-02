import { Friend, LeastUserInfo } from '../../utils/types';
import { parseNameOfFriend } from './parseNameOfFirend';

/**
 * @description Parse the name of anyone. If he's stranger, return the username. If he's a friend,
 * parse friend's name.
 */
export function parseAnyoneName({ unknownUser, friends }: Params) {
  const searchedFriend = friends.find((friend) => friend.friend.id === unknownUser.id);
  return searchedFriend ? parseNameOfFriend(searchedFriend) : unknownUser.user_name;
}

interface Params {
  unknownUser: LeastUserInfo;
  friends: Friend[];
}
