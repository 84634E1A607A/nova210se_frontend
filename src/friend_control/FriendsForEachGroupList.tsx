import { Friend } from '../utils/types';

type Porps = { friends: Friend[] };

export function FriendsForEachGroupList({ friends }: Porps) {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <li key={friend.friend.id}>
            {friend.nickname === undefined || friend.nickname === null || friend.nickname === ''
              ? friend.friend.user_name
              : friend.nickname}
          </li>
        );
      })}
    </ul>
  );
}
