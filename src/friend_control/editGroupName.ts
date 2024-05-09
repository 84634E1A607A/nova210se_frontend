import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function editGroupName(newName: string, groupId: number) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`),
      {
        method: 'PATCH',
        body: JSON.stringify({ group_name: newName }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    if (!response.ok) {
      throw new Error('Failed to edit group name');
    }
    return true;
  } catch (e) {
    console.log(expectedException, e);
    window.alert('Failed to edit group name');
    return false;
  }
}
