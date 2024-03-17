import { assertIsFriend } from '../utils/asserts';

export async function getFriendInfo(friend_user_id: number) {
  try {
    const response = await fetch(
      process.env.REACT_APP_API_URL!.concat(`/friend/${friend_user_id}`),
    );
    const data = await response.json();
    const friend = data.body;
    assertIsFriend(friend);
    return friend;
  } catch (e) {
    console.error(e);
    window.alert('Failed to get friend info');
  }
}
