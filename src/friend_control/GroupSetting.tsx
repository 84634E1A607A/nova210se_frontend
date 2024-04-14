import { useNavigate } from 'react-router-dom';
import { editGroupName } from './editGroupName';
import { getGroupsList } from './getGroupsList';
import { deleteGroup } from './deleteGroup';
import { useUserName } from '../utils/UrlParamsHooks';
import { Friend, Group } from '../utils/types';
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
    const group = groups.find((group) => group.group_name === newGroupName);
    if (group) {
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
    <>
      <form onSubmit={handleSubmit((form) => dispatchChangeGroupName(form))}>
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
            className={getEditorStyle(errors.new_group_name)}
          />
          <ValidationError fieldError={errors.new_group_name} />
        </div>
        <div>
          <button type="submit">edit</button>
        </div>
      </form>
      <button type="button" onClick={() => dispatchDelete(groupId)}>
        Delete Group
      </button>
    </>
  );
}

interface GroupSettingInfo {
  new_group_name: string;
}
