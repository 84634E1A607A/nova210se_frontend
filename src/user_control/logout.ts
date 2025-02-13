import { expectedException } from '../utils/consts/DebugAndDevConsts';

export async function logout() {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat(`/user/logout`), {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to logout');
    return true;
  } catch (e) {
    console.log(expectedException, e);
    window.alert('Failed to logout');
    return false;
  }
}
