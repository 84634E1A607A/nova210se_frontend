import { useCookies } from 'react-cookie';
import { ActionFunctionArgs, Form, redirect, useParams } from 'react-router-dom';
import { editGroupName } from './editGroupName';

type Params = { group_id: string; user_name: string };
type Setting = { new_group_name: string; user_name: string; token: string; group_id: number };

export function GroupSetting() {
  const params = useParams<Params>();
  const group_id = parseInt(params.group_id!);

  const [cookie] = useCookies(['csrftoken']);

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
        <input type="hidden" name="token" id="token" value={cookie.csrftoken!} />
        <input type="hidden" name="group_id" id="group_id" value={group_id} />
        <div>
          <button type="submit">submit</button>
        </div>
      </Form>
    </div>
  );
}

export async function groupSettingAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const setting = {
    new_group_name: formData.get('new_group_name'),
    user_name: formData.get('user_name'),
    token: formData.get('token'),
    group_id: Number(formData.get('group_id')),
  } as Setting;

  await editGroupName(setting.new_group_name, setting.group_id, setting.token);

  // TODO: worry about redirect will erase login state
  return redirect(`${setting.user_name}/friends`);
}
