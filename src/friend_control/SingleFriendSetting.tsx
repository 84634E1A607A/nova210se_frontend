import { useParams } from 'react-router-dom';
import { DeleteFriendButton } from './DeleteFriendButton';
import { useForm } from 'react-hook-form';
import { getGroupsList } from './getGroupsList';
import { createGroup } from './createGroup';
import { useCookies } from 'react-cookie';
import { addFriendForGroup } from './addFriendForGroup';
import { getFriendInfo } from './getFriendInfo';

type Params = { user_name: string; friend_user_id: string };
type GroupForm = { target_group_name: string };

export function SingleFriendSetting() {
  const params = useParams<Params>();
  const [cookie] = useCookies(['csrftoken']);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GroupForm>();

  const handleChangedGroupOfFriend = async ({ target_group_name }: GroupForm) => {
    if (target_group_name === 'default') {
    }
    const groups = await getGroupsList();
    const group = groups.find((group) => group.group_name === target_group_name);
    if (group === undefined) {
      const newGroup = await createGroup(target_group_name, cookie.csrftoken!);
      if (newGroup === undefined) window.alert('Failed to create group');
      else
        await addFriendForGroup(
          newGroup.group_id,
          parseInt(params.friend_user_id!),
          cookie.csrftoken!,
        );
    } else {
      const friend = await getFriendInfo(parseInt(params.friend_user_id!));
      if (friend!.group.group_name === target_group_name)
        window.alert('Friend already in this group');
      else
        await addFriendForGroup(
          group.group_id,
          parseInt(params.friend_user_id!),
          cookie.csrftoken!,
        );
    }
  };

  return (
    <div>
      <DeleteFriendButton friendUserId={parseInt(params.friend_user_id!)} />
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
