import { assertIsGroup } from '../utils/Asserts';
import { Group } from '../utils/Types';

export async function queryGroup(groupId: number): Promise<Group | undefined> {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    const data = await response.json();
    const group = data.data;
    if (group === undefined) throw new Error('Response does not contain group');
    assertIsGroup(group);
    return group;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get group');
  }
}
