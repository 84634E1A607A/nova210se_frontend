import { assertIsGroup } from '../utils/asserts';
import { Group } from '../utils/types';

/* For now, group can only be created in a friend's setting */
export async function createGroup(group_name: string, csrftoken: string) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/group/add'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ group_name }),
    });
    if (response.status === 400 || response.status === 403) return undefined;
    const data = await response.json();
    const group = data.body;
    assertIsGroup(group);
    return group;
  } catch (e) {
    console.error(e);
    window.alert('Failed to create group');
  }
}
