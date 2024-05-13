import { Friend, Group } from '../utils/Types';
import { FriendsForEachGroupList } from './FriendsForEachGroupList';

/**
 * @param friends All friends of current user
 * @param groups All groups set by current user
 * @constructor
 */
export function FriendsList({ friends, groups }: Props) {
  return (
    <>
      <ul>
        {groups.map((group) => {
          return (
            <li key={group.group_id} className="border-1 box-border rounded-sm shadow-md">
              <FriendsForEachGroupList
                friendsInGroup={friends.filter((friend) => {
                  return friend.group.group_id === group.group_id;
                })}
                group={group}
                allFriends={friends}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

interface Props {
  friends: Friend[];
  groups: Group[];
}
