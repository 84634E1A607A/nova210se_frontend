import { useCollapse } from 'react-collapsed';
import { Friend, Group } from '../utils/Types';
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
      <div className="flex flex-row rounded-md bg-teal-100 p-1 font-medium">
        {
          /* Padding when not default*/
          isDefaultGroup ? null : <div className="w-[1.5rem]" />
        }
        <div className="grow">{group.group_name === '' ? 'default' : group.group_name}</div>
        {isDefaultGroup ? null : (
          <div
            {...getToggleProps()}
            role="img"
            aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
            className={`${group.group_name === '' ? 'hidden' : ''} flex w-[1.5rem] cursor-pointer items-end justify-center`}
          >
            <SettingIcon className="w-[1rem] fill-teal-900" />
          </div>
        )}
      </div>
      <div {...getCollapseProps()} className={`grow ${isDefaultGroup ? 'hidden' : ''}`}>
        {isLoading ? (
          <p>is loading</p>
        ) : (
          <GroupSetting group={group} defaultGroup={defaultGroup!} />
        )}
      </div>

      <div className="w-full p-1">
        <div className="mx-2 mt-2">
          {friendsInGroup.length === 0 ? (
            <div className="text-gray-500">No friends are in this group</div>
          ) : (
            <DataView value={friendsInGroup} listTemplate={listTemplate} />
          )}
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
