import { Friend } from '../utils/types';
import { UserDisplayTab } from './UserDisplayTab';

type Porps = { friends: Friend[] };

export function FriendsForEachGroupList({ friends }: Porps) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <li key={friend.friend.id}>
            <UserDisplayTab leastUserInfo={friend.friend} />
          </li>
        );
      })}
    </ul>
  );
}
