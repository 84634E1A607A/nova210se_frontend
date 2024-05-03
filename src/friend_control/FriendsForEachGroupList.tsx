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

  const isDefaultGroup = group.group_name === '';

  return (
    <div className="m-2 flex flex-col">
      <div className="p-1 font-medium" style={{ backgroundColor: theme.secondary_container }}>
        <p>{group.group_name === '' ? 'default' : group.group_name}</p>
        <span
          {...getToggleProps()}
          role="img"
          aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
          className={`${group.group_name === '' ? 'hidden' : ''} inline-block w-10 cursor-pointer items-center`}
        >
          {isDefaultGroup ? null : isExpanded ? (
            <Foldup className="h-6 w-6 fill-teal-900" />
          ) : (
            <Folddown className="h-6 w-6 fill-teal-900" />
          )}
        </span>
      </div>
      <div {...getCollapseProps()} className={`grow ${isDefaultGroup ? 'hidden' : ''}`}>
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
