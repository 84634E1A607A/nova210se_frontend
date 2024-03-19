import { ActionFunctionArgs, Form, redirect, useParams } from 'react-router-dom';
import { editGroupName } from './editGroupName';
import { getGroupsList } from './getGroupsList';
import { deleteGroup } from './deleteGroup';

type Params = { group_id: string; user_name: string };
type Setting = { new_group_name: string; user_name: string; group_id: number };

export function GroupSetting() {
  const params = useParams<Params>();
  const group_id = parseInt(params.group_id!);

  return (
    <div>
      <Form method="post">
        <div>
          <label htmlFor="new_group_name">New group name</label>
          <input
            type="text"
            name="new_group_name"
            id="new_group_name"
            required
            pattern="^[\w@+\-.]+$"
          />
        </div>
        <input type="hidden" name="user_name" id="user_name" value={params.user_name!} />
        <input type="hidden" name="group_id" id="group_id" value={group_id} />
        <div>
          <button type="submit">edit</button>
        </div>
      </Form>
      <button type="button" onClick={() => deleteGroup(group_id)}>
        Delete
      </button>
    </div>
  );
}

export async function groupSettingAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const setting = {
    new_group_name: formData.get('new_group_name'),
    user_name: formData.get('user_name'),
    group_id: Number(formData.get('group_id')),
  } as Setting;

  const groups = await getGroupsList();
  const group = groups.find((group) => group.group_name === setting.new_group_name);
  if (group) {
    window.alert('Group name already exists');
    return redirect(`${setting.user_name}/group_setting/${setting.group_id}`);
  }

  await editGroupName(setting.new_group_name, setting.group_id);

  // TODO: worry about redirect will erase login state
  return redirect(`${setting.user_name}/friends`);
}
