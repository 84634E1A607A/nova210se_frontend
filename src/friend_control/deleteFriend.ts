import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function deleteFriend(friendUserId: number) {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/friend/${friendUserId}`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete friend');
    }
    return true;
  } catch (e) {
    console.log(expectedException, e);
    window.alert('Failed to delete friend');
    return false;
  }
}
