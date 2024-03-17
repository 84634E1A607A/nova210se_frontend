import { assertIsGroupsList } from '../utils/asserts';
import { Group } from '../utils/types';

export async function getGroupsList(): Promise<Group[]> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/group/list'));
    const data = await response.json();
    const groupsList = data.body;
    assertIsGroupsList(groupsList);
    return groupsList;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get groups list');
    return [];
  }
}
