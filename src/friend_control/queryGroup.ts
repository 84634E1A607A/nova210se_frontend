import { assertIsGroup } from '../utils/asserts';
import { Group } from '../utils/types';

export async function queryGroup(groupId: number): Promise<Group | undefined> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/group/${groupId}`));
    const data = await response.json();
    const group = data.body;
    assertIsGroup(group);
    return group;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get group');
  }
}
