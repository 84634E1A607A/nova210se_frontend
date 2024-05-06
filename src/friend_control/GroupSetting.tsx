import { useNavigate } from 'react-router-dom';
import { editGroupName } from './editGroupName';
import { getGroupsList } from './getGroupsList';
import { deleteGroup } from './deleteGroup';
import { useUserName } from '../utils/UrlParamsHooks';
import { Friend, Group } from '../utils/Types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';

type Props = { group: Group; defaultGroup: Group };

export function GroupSetting({ group, defaultGroup }: Props) {
  const userName = useUserName();
  const groupId = group.group_id;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<GroupSettingInfo>();

  const changeGroupNameAgent: (_data: GroupSettingInfo) => Promise<{
    changeSuccessful: boolean;
    newGroupName: string;
  }> = async (data) => {
    const newGroupName = data.new_group_name;
    const groups = await getGroupsList();
    const groupFound = groups.find((item) => item.group_name === newGroupName);
    if (groupFound) {
      window.alert('Group name already exists');
      return { changeSuccessful: false, newGroupName };
    }
    if (newGroupName === 'default') {
      window.alert('Cannot use default as group name');
      return { changeSuccessful: false, newGroupName };
    }

    const successful = await editGroupName(newGroupName, groupId);
    return { changeSuccessful: successful, newGroupName };
  };

  const { mutate: dispatchChangeGroupName } = useMutation({
    mutationFn: changeGroupNameAgent,
    onSuccess: ({ changeSuccessful, newGroupName }) => {
      if (changeSuccessful) {
        queryClient.setQueryData<Group[]>(['groups'], (oldGroups) => {
          return oldGroups!.map((oldGroup) => {
            if (oldGroup.group_id === groupId) {
              return { ...oldGroup, group_name: newGroupName };
            }
            return oldGroup;
          });
        });
        queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
          if (!oldFriends) return [];
          return oldFriends.map((oldFriend) => {
            if (oldFriend.group.group_id === groupId) {
              return { ...oldFriend, group: { ...group, group_name: newGroupName } };
            }
            return oldFriend;
          });
        });
      }
      navigate(`/${userName}/friends`);
    },
  });

  const { mutate: dispatchDelete } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: (deleteSuccessful) => {
      if (deleteSuccessful) {
        queryClient.setQueryData<Group[]>(['groups'], (oldGroups) => {
          return oldGroups!.filter((oldGroup) => oldGroup.group_id !== groupId);
        });
        queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
          if (!oldFriends) return [];
          return oldFriends.map((oldFriend) => {
            if (oldFriend.group.group_id === groupId) {
              return { ...oldFriend, group: defaultGroup };
            }
            return oldFriend;
          });
        });
        navigate(`/${userName}/friends`);
      }
    },
  });

  return (
    <div className="h-41 box-border w-full items-center justify-center px-0 py-4 shadow-lg">
      <form
        onSubmit={handleSubmit((form) => dispatchChangeGroupName(form))}
        className="mb-1 flex flex-grow flex-row items-center justify-center"
      >
        <div>
          <label htmlFor="new_group_name">New group name</label>
          <input
            type="text"
            id="new_group_name"
            {...register('new_group_name', {
              required: 'You must enter a new group name',
              pattern: /^[\w@+\-.\\/]+$/,
              maxLength: 19,
            })}
            className={`${getEditorStyle(errors.new_group_name)} mt-1 block w-60 rounded-md border 
            border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500
            disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 
            disabled:shadow-none
           `}
          />
          <ValidationError fieldError={errors.new_group_name} />
        </div>
        <div>
          <button type="submit" className="ms-3">
            edit
          </button>
        </div>
      </form>
      <button
        type="button"
        className="focus:shadow-outline mb-4 rounded bg-red-500 px-4 py-2 font-bold 
    text-white hover:bg-red-600 focus:border-red-500 focus:outline-none focus:ring-1
      focus:ring-red-500"
        onClick={() => dispatchDelete(groupId)}
      >
        Delete Group
      </button>
    </div>
  );
}

interface GroupSettingInfo {
  new_group_name: string;
}
