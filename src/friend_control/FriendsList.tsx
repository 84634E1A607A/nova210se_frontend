import { Friend, Group } from '../utils/types';
import { FriendsForEachGroupList } from './FriendsForEachGroupList';

type Props = { friends: Friend[]; groups: Group[] };

export function FriendsList({ friends, groups }: Props) {
  return (
    <>
      <ul>
        {groups.map((group) => {
          return (
            <li key={group.group_id}>
              <FriendsForEachGroupList
                friends={friends.filter((friend) => {
                  return friend.group.group_id === group.group_id;
                })}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
