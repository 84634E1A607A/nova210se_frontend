import { assertIsGroupsList } from '../utils/Asserts';
import { Group } from '../utils/types';

export async function getGroupsList(): Promise<Group[]> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/group/list'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    const groupsList = data.data;
    if (groupsList === undefined) throw new Error('Response does not contain groups list');
    assertIsGroupsList(groupsList);
    return groupsList;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get groups list');
    return [];
  }
}
