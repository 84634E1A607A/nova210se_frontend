import { assertIsFriendsList } from '../utils/asserts';
import { Friend } from '../utils/types';

export async function getFriendsList(): Promise<Friend[]> {
  const response = await fetch(process.env.REACT_APP_API_URL!.concat('friend'));
  const data = await response.json();
  const friendsList = data.body;
  assertIsFriendsList(friendsList);
  return friendsList;
}
