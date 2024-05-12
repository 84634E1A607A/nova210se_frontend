import { useForm } from 'react-hook-form';
import { getGroupsList } from './getGroupsList';
import { createGroup } from './createGroup';
import { updateFriend } from './updateFriend';
import { getFriendInfo } from './getFriendInfo';
import { getDefaultGroup } from './getDefaultGroup';
import { useUserName } from '../utils/router/RouteParamsHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Friend, Group } from '../utils/Types';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { assertIsFriendsData } from '../utils/AssertsForRouterLoader';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { DeleteFriendButton } from './DeleteFriendButton';

type GroupForm = { target_group_name: string; nickname: string };
type Props = { friendUserId: number };

export function SingleFriendSetting({ friendUserId }: Props) {
  const userName = useUserName();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    reset,
  } = useForm<GroupForm>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      target_group_name: '',
      nickname: '',
    },
  });

  const handleChangedGroupOfFriend: (_form: GroupForm) => Promise<{
    changeSuccessful: boolean;
    newGroupEstablished: boolean;
    changingGroup: Group | undefined;
    friendOfConcern: Friend | undefined;
    nickname: string | undefined;
  }> = async ({ target_group_name, nickname }) => {
    const noChangingReturnBody = {
      changeSuccessful: false,
      newGroupEstablished: false,
      changingGroup: undefined,
      friendOfConcern: undefined,
      nickname: undefined,
    };
    if (target_group_name === '' && nickname === '') {
      setError('target_group_name', {
        message: 'At least one field should be filled',
      });
      setError('nickname', { message: 'At least one field should be filled' });
      return Promise.resolve(noChangingReturnBody);
    }

    const friend = await getFriendInfo(friendUserId);
    if (!friend) {
      window.alert('Friend not found');
      return Promise.resolve(noChangingReturnBody);
    }

    const currentGroupName = friend.group.group_name;
    if (target_group_name === 'default' && currentGroupName === '') {
      window.alert('Friend already in default group');
      return Promise.resolve(noChangingReturnBody);
    }
    if (friend.nickname === nickname && nickname !== '') {
      window.alert('Nickname must be changed if you modify nickname field');
      return Promise.resolve(noChangingReturnBody);
    }
    let createNewGroupSuccessful = false;
    let groupId;
    let groupOfConcern: Group | undefined = undefined;
    if (target_group_name === 'default') {
      groupOfConcern = await getDefaultGroup();
      groupId = groupOfConcern.group_id;
    } else if (target_group_name !== '') {
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
    let changeSuccessful: boolean;
    if (target_group_name === '')
      changeSuccessful = await updateFriend(nickname, undefined, friendUserId);
    else changeSuccessful = await updateFriend(nickname, groupId, friendUserId);
    return {
      changeSuccessful,
      newGroupEstablished: createNewGroupSuccessful,
      changingGroup: groupOfConcern,
      friendOfConcern: friend,
      nickname: nickname === '' ? undefined : nickname,
    };
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const data = useLoaderData();
  assertIsFriendsData(data);

  const { mutate } = useMutation({
    mutationFn: handleChangedGroupOfFriend,
    onSuccess: ({
      changeSuccessful,
      newGroupEstablished,
      changingGroup,
      friendOfConcern,
      nickname,
    }) => {
      queryClient.setQueryData<Group[]>(['groups'], (oldGroups) => {
        if (newGroupEstablished) return [...oldGroups!, changingGroup!]; // default must exist
        return [...oldGroups!];
      });
      queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
        if (!changeSuccessful) return [...oldFriends!];
        return oldFriends!.map((friend) => {
          if (friend.friend.id === friendOfConcern!.friend.id) {
            let groupBeingSet = friend.group;
            const oldNickname = friend.nickname;
            if (changingGroup !== undefined) groupBeingSet = changingGroup;
            return {
              ...friend,
              group: groupBeingSet,
              nickname: nickname === undefined ? oldNickname : nickname,
            };
          }
          return { ...friend };
        });
      });
      if (changeSuccessful) {
        navigate(`/${userName}/friends`);
        reset();
      }
    },
  });

  return (
    <div className="h-50 box-border flex w-full flex-col items-center justify-center px-0 py-4 shadow-lg">
      <form
        onSubmit={handleSubmit((form) => mutate(form))}
        className="mb-3 flex flex-grow flex-row items-center justify-center"
      >
        <div className="mx-2">
          <label
            htmlFor="target_group_name"
            title="Type in 'default' to switch to default group'"
            className="block text-sm font-medium text-slate-700"
          >
            Change or create group
          </label>
          <input
            type="text"
            id="target_group_name"
            {...register('target_group_name', {
              pattern: /^[\w@+\-.]+$/,
              maxLength: 19,
            })}
            className={`${getEditorStyle(errors.target_group_name)} mt-1 block w-60 rounded-md border 
            border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 
            disabled:shadow-none
           `}
          />
          <ValidationError fieldError={errors.target_group_name} />
        </div>
        <div className="mx-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-slate-700">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            {...register('nickname', {
              pattern: /^[\w@+\-.]+$/,
              maxLength: 99,
            })}
            className={`${getEditorStyle(errors.nickname)} mt-1 block w-60 rounded-md border 
            border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 
            disabled:shadow-none
           `}
          />
          <ValidationError fieldError={errors.nickname} />
        </div>
        <div className="mx-2">
          <button type="submit" disabled={isSubmitting}>
            submit
          </button>
        </div>
      </form>

      <DeleteFriendButton friendUserId={friendUserId} />
    </div>
  );
}
