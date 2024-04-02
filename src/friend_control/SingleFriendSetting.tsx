import { useForm } from 'react-hook-form';
import { getGroupsList } from './getGroupsList';
import { createGroup } from './createGroup';
import { addFriendForGroup } from './addFriendForGroup';
import { getFriendInfo } from './getFriendInfo';
import { getDefaultGroup } from './getDefaultGroup';
import { useFriendUserId, useUserName } from '../utils/UrlParamsHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Friend, Group } from '../utils/types';
import { Await, Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import { UserDisplayTab } from './UserDisplayTab';
import { assertIsFriendsList } from '../utils/asserts';
import { assertIsFriendsData } from '../utils/queryRouterLoaderAsserts';
import { Suspense } from 'react';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';

type GroupForm = { target_group_name: string };

export function SingleFriendSetting() {
  const friendUserId = useFriendUserId();
  const userName = useUserName();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<GroupForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

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
  const data = useLoaderData();
  assertIsFriendsData(data);

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
      <p>Friend setting</p>
      <Suspense>
        <Await resolve={data.friends}>
          {(friends) => {
            assertIsFriendsList(friends);
            const thisFriend = getThisFriend(friends, friendUserId);
            if (!thisFriend) return <Navigate to={`/${userName}/invalid`} />;
            return <UserDisplayTab leastUserInfo={thisFriend.friend} inSetting={true} />;
          }}
        </Await>
      </Suspense>

      <form onSubmit={handleSubmit((form) => mutate(form))}>
        <div>
          <label htmlFor="target_group_name">
            Change group, if not existed, will create one. Type 'default' to switch to default group
          </label>
          <input
            type="text"
            id="target_group_name"
            {...register('target_group_name', {
              required: true,
              pattern: /^[\w@+\-.]+$/,
              maxLength: 19,
              minLength: 1,
            })}
            className={getEditorStyle(errors.target_group_name)}
          />
          <ValidationError fieldError={errors.target_group_name} />
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

function getThisFriend(friends: Friend[], friendUserId: number) {
  const thisFriend = friends.find((friend) => friend.friend.id === friendUserId);
  return thisFriend;
}
