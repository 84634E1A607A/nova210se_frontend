import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function deleteAccount() {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/user`), {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete account');
    return true;
  } catch (e) {
    console.log(expectedException, e);
    window.alert('Failed to delete account');
    return false;
  }
}
