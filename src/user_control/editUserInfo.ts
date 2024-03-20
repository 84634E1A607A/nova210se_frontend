import { assertIsLeastUserInfo } from '../utils/asserts';

/**
 *
 * @param old_password?: string
 * @param new_password?: string
 * @param avatar_url?: string
 * @returns Promise<LeastUserInfo | undefined>
 * Without new_password, the old_password can be arbitrary
 */
export async function editUserInfo(
  old_password?: string,
  new_password?: string,
  avatar_url?: string,
) {
  if (old_password === undefined) old_password = '';
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/user'), {
      method: 'PATCH',
      body: JSON.stringify({
        old_password,
        new_password,
        avatar_url,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }
    const data = await response.json();
    const user = data.data;
    assertIsLeastUserInfo(user);
    return user;
  } catch (e) {
    console.error(e);
    window.alert('Failed to edit user info!');
  }
}
