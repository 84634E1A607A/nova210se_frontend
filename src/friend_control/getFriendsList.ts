import { assertIsFriendsList } from '../utils/asserts';
import { Friend } from '../utils/types';

export async function getFriendsList(): Promise<Friend[]> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    let friendsList = data.data;
    if (friendsList === undefined) friendsList = [];
    assertIsFriendsList(friendsList);
    return friendsList;
  } catch (e) {
    console.error(e);
    return [];
  }
}
