import { useCollapse } from 'react-collapsed';
import { Friend, Group } from '../utils/types';
import { theme } from '../utils/ui/themes';
import { UserDisplayTab } from './UserDisplayTab';
import { ReactComponent as Foldup } from '../svg/fold-up-svgrepo-com.svg';
import { ReactComponent as Folddown } from '../svg/fold-down-svgrepo-com.svg';
import { GroupSetting } from './GroupSetting';
import { useQuery } from '@tanstack/react-query';
import { getDefaultGroup } from './getDefaultGroup';

type Porps = { friends: Friend[]; group: Group };

export function FriendsForEachGroupList({ friends, group }: Porps) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const { isLoading, data: defaultGroup } = useQuery({
    queryKey: ['default_group'],
    queryFn: getDefaultGroup,
  });

  return (
    <div className="flex flex-col m-2">
      <div className="font-medium p-1" style={{ backgroundColor: theme.secondary_container }}>
        <p>{group.group_name === '' ? 'default' : group.group_name}</p>
        <span
          {...getToggleProps()}
          role="img"
          aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
          className={`${group.group_name === '' ? 'hidden' : ''} inline-block w-10 cursor-pointer items-center`}
        >
          {isExpanded ? (
            <Foldup className="fill-teal-900 w-6 h-6" />
          ) : (
            <Folddown className="fill-teal-900 w-6 h-6" />
          )}
        </span>
      </div>
      <div {...getCollapseProps()} className={`grow ${group.group_name === '' ? 'hidden' : ''}`}>
        {isLoading ? (
          <p>is loading</p>
        ) : (
          <GroupSetting group={group} defaultGroup={defaultGroup!} />
        )}
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
