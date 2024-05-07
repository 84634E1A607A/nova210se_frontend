import { useCollapse } from 'react-collapsed';
import { Friend, Group } from '../utils/Types';
import { theme } from '../utils/ui/themes';
import { UserDisplayTab } from './UserDisplayTab';
import { GroupSetting } from './GroupSetting';
import { useQuery } from '@tanstack/react-query';
import { DataView } from 'primereact/dataview';
import { ReactComponent as SettingIcon } from '../svg/nav-setting-icon.svg';

import { getDefaultGroup } from './getDefaultGroup';
import React, { ReactNode } from 'react';

export function FriendsForEachGroupList({ friendsInGroup, group, allFriends }: Props) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
  const { isLoading, data: defaultGroup } = useQuery({
    queryKey: ['default_group'],
    queryFn: getDefaultGroup,
  });

  const isDefaultGroup = group.group_name === '';

  const listTemplate = (items: Friend[]): ReactNode[] | undefined => {
    if (items.length === 0) return undefined;

    const element = (
      <ul key={group.group_id}>
        {items.map((friend) => {
          return (
            <li key={friend.friend.id}>
              <UserDisplayTab leastUserInfo={friend.friend} friendsList={allFriends} />
            </li>
          );
        })}
      </ul>
    );
    return [element as ReactNode];
  };

  return (
    <div className="m-2 flex flex-col">
      <div className="p-1 font-medium" style={{ backgroundColor: theme.secondary_container }}>
        <p>{group.group_name === '' ? 'default' : group.group_name}</p>
        <span
          {...getToggleProps()}
          role="img"
          aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
          className={`${group.group_name === '' ? 'hidden' : ''} flex cursor-pointer items-end justify-center`}
        >
          {isDefaultGroup ? null : <SettingIcon className="h-3 w-3 fill-teal-900" />}
        </span>
      </div>
      <div {...getCollapseProps()} className={`grow ${isDefaultGroup ? 'hidden' : ''}`}>
        {isLoading ? (
          <p>is loading</p>
        ) : (
          <GroupSetting group={group} defaultGroup={defaultGroup!} />
        )}
      </div>

      <div className="w-full p-1">
        <div className="mx-6 mt-2">
          <DataView value={friendsInGroup} listTemplate={listTemplate} />
        </div>
      </div>
    </div>
  );
}

interface Props {
  friendsInGroup: Friend[];
  group: Group;
  allFriends: Friend[];
}
