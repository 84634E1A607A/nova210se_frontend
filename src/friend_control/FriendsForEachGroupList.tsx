import { Friend, Group } from '../utils/types';
import { theme } from '../utils/ui/themes';
import { UserDisplayTab } from './UserDisplayTab';

type Porps = { friends: Friend[]; group: Group };

export function FriendsForEachGroupList({ friends, group }: Porps) {
  return (
    <div className="flex flex-col m-2">
      <div className="font-medium p-1" style={{ backgroundColor: theme.secondary_container }}>
        <p>{group.group_name === '' ? 'default' : group.group_name}</p>
      </div>

      <div className="p-1">
        <ul>
          {friends.map((friend) => {
            return (
              <li key={friend.friend.id}>
                <UserDisplayTab leastUserInfo={friend.friend} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
