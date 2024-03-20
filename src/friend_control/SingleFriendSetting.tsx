import { DeleteFriendButton } from './DeleteFriendButton';
import { useForm } from 'react-hook-form';
import { getGroupsList } from './getGroupsList';
import { createGroup } from './createGroup';
import { addFriendForGroup } from './addFriendForGroup';
import { getFriendInfo } from './getFriendInfo';
import { getDefaultGroup } from './getDefaultGroup';
import { useFriendUserId } from '../utils/UrlParamsHooks';

type GroupForm = { target_group_name: string };

export function SingleFriendSetting() {
  const friendUserId = useFriendUserId();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GroupForm>();

  const handleChangedGroupOfFriend = async ({ target_group_name }: GroupForm) => {
    const friend = await getFriendInfo(friendUserId);
    if (!friend) return;

    const currentGroupName = friend.group.group_name;
    if (target_group_name === 'default' && currentGroupName === '') {
      window.alert('Friend already in default group');
      return;
    }

    let groupId;
    if (target_group_name === 'default')
      groupId = await getDefaultGroup().then((group) => group!.group_id);
    else {
      const groups = await getGroupsList();
      const group = groups.find((group) => group.group_name === target_group_name);

      if (!group) {
        const newGroup = await createGroup(target_group_name);
        if (!newGroup) {
          window.alert('Failed to create group');
          return;
        }
        groupId = newGroup.group_id;
      } else if (currentGroupName === target_group_name) {
        window.alert('Friend already in this group');
        return;
      } else {
        groupId = group.group_id;
      }
    }
    await addFriendForGroup(groupId, friendUserId);
  };

  return (
    <div>
      <DeleteFriendButton friendUserId={friendUserId} />
      <form onSubmit={handleSubmit(handleChangedGroupOfFriend)}>
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
