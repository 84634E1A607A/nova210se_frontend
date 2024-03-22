import { DeleteFriendButton } from './DeleteFriendButton';
import { useForm } from 'react-hook-form';
import { getGroupsList } from './getGroupsList';
import { createGroup } from './createGroup';
import { addFriendForGroup } from './addFriendForGroup';
import { getFriendInfo } from './getFriendInfo';
import { getDefaultGroup } from './getDefaultGroup';
import { useFriendUserId, useUserName } from '../utils/UrlParamsHooks';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { Friend, Group } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { UserDisplayTab } from './UserDisplayTab';
import { assertIsFriendsList } from '../utils/asserts';

type GroupForm = { target_group_name: string };

export function SingleFriendSetting() {
  const friendUserId = useFriendUserId();
  const userName = useUserName();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GroupForm>();

  const handleChangedGroupOfFriend: (_form: GroupForm) => Promise<{
    changeSuccessful: boolean;
    newGroupEstablished: boolean;
    changingGroup: Group | undefined;
    friendOfConcern: Friend | undefined;
  }> = async ({ target_group_name }) => {
    const noChangingReturnBody = {
      changeSuccessful: false,
      newGroupEstablished: false,
      changingGroup: undefined,
      friendOfConcern: undefined,
    };
    const friend = await getFriendInfo(friendUserId);
    if (!friend) return Promise.resolve(noChangingReturnBody);

    const currentGroupName = friend.group.group_name;
    if (target_group_name === 'default' && currentGroupName === '') {
      window.alert('Friend already in default group');
      return Promise.resolve(noChangingReturnBody);
    }
    let createNewGroupSuccessful = false;
    let groupId;
    let groupOfConcern: Group;
    if (target_group_name === 'default') {
      groupOfConcern = await getDefaultGroup();
      groupId = groupOfConcern!.group_id;
    } else {
      const groups = await getGroupsList();
      const group = groups.find((group) => group.group_name === target_group_name);

      if (!group) {
        const newGroup = await createGroup(target_group_name);
        createNewGroupSuccessful = true;
        if (!newGroup) {
          window.alert('Failed to create group');
          return Promise.resolve(noChangingReturnBody);
        }
        groupId = newGroup.group_id;
        groupOfConcern = newGroup;
      } else if (currentGroupName === target_group_name) {
        window.alert('Friend already in this group');
        return Promise.resolve(noChangingReturnBody);
      } else {
        groupId = group.group_id;
        groupOfConcern = group;
      }
    }
    await addFriendForGroup(groupId, friendUserId);
    return {
      changeSuccessful: true,
      newGroupEstablished: createNewGroupSuccessful,
      changingGroup: groupOfConcern,
      friendOfConcern: friend,
    };
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: handleChangedGroupOfFriend,
    onSuccess: ({ changeSuccessful, newGroupEstablished, changingGroup, friendOfConcern }) => {
      queryClient.setQueryData<Group[]>(['groups'], (oldGroups) => {
        if (newGroupEstablished) return [...oldGroups!, changingGroup!]; // default must exist
        return [...oldGroups!];
      });
      queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
        if (!changeSuccessful) return [...oldFriends!];
        return oldFriends!.map((friend) => {
          if (friend.friend.id === friendOfConcern!.friend.id)
            return { ...friend, group: changingGroup! };
          return { ...friend };
        });
      });
      if (changeSuccessful) {
        if (newGroupEstablished) window.alert(`New group ${changingGroup!.group_name} created`);
        window.alert(
          `Friend ${friendOfConcern!.friend.user_name} moved to group ${changingGroup!.group_name === '' ? 'default' : changingGroup!.group_name}`,
        );
        navigate(`/${userName}/friends/${friendUserId}`);
      }
    },
  });

  return (
    <div>
      <UserDisplayTab leastUserInfo={getThisFriend(queryClient, friendUserId)} />
      <DeleteFriendButton friendUserId={friendUserId} />
      <form onSubmit={handleSubmit((form) => mutate(form))}>
        <div>
          <label htmlFor="target_group_name">
            Change group, if not existed, will create one. Type 'default' to switch to default group
          </label>
          <input
            type="text"
            id="target_group_name"
            {...register('target_group_name', { required: true, pattern: /^[\w@+\-.]+$/ })}
          />
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            submit
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * notice: I used getQueryData because I'm sure once the user reaches here, the react-query cache
 * for friends is certainly valid, can't be nothing or broken. There are also similar usages in other
 * modules.
 */
function getThisFriend(queryClient: QueryClient, friendUserId: number) {
  const friends = queryClient.getQueryData<Friend[]>(['friends']);
  assertIsFriendsList(friends);

  return friends.find((friend) => friend.friend.id === friendUserId)!.friend;
}
