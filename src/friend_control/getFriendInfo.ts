import { assertIsFriend } from '../utils/Asserts';
import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function getFriendInfo(friend_user_id: number) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/${friend_user_id}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    const data = await response.json();
    const friend = data.data;
    if (friend === undefined) throw new Error('Response does not contain friend');
    assertIsFriend(friend);
    return friend;
  } catch (e) {
    console.log(expectedException, e);
  }
}
