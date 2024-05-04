import { Friend, LeastFriendInfo, LeastUserInfo } from '../../utils/Types';
import { parseNameOfFriend } from '../../friend_control/utils/parseNameOfFirend';

/**
 * @description Get all the friends that aren't in a group chat.
 */
export function getInvitableFriends({ friends, membersWithoutSelf }: Params) {
  const invitableFriends = friends.filter((friend) => {
    return !membersWithoutSelf.some((member) => member.id === friend.friend.id);
  });
  return invitableFriends.map((friend) => {
    return {
      userId: friend.friend.id,
      avatarUrl: friend.friend.avatar_url,
      displayName: parseNameOfFriend(friend),
    } as LeastFriendInfo;
  });
}

interface Params {
  friends: Friend[];
  membersWithoutSelf: LeastUserInfo[];
}
