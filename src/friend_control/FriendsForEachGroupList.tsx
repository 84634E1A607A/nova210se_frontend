import { Link } from 'react-router-dom';
import { Friend } from '../utils/types';
import { UserDisplayTab } from './UserDisplayTab';
import { useUserName } from '../utils/UrlParamsHooks';

type Porps = { friends: Friend[] };

export function FriendsForEachGroupList({ friends }: Porps) {
  const userName = useUserName();

  return (
    <ul>
      {friends.map((friend) => {
        return (
          <li key={friend.friend.id}>
            {/* {friend.nickname === undefined || friend.nickname === null || friend.nickname === ''
              ? friend.friend.user_name
              : friend.nickname} */}
            <UserDisplayTab leastUserInfo={friend.friend} />
            <Link to={`/${userName}/friends/${friend.friend.id}`}>
              Click to set for this friend
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
