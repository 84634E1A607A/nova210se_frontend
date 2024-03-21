import { assertIsLeastUserInfo } from '../utils/asserts';

/**
 *
 * @param old_password: string
 * @param new_password: string
 * @param avatar_url: string
 * @returns Promise<LeastUserInfo | undefined>
 * Without new_password, the old_password can be arbitrary
 */
export async function editUserInfo(old_password: string, new_password: string, avatar_url: string) {
  const avatarUrlInRequestBody = avatar_url === '' ? {} : { avatar_url };
  const requestBody =
    new_password === ''
      ? { ...avatarUrlInRequestBody }
      : { old_password, new_password, ...avatarUrlInRequestBody };
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/user'), {
      method: 'PATCH',
      body: JSON.stringify(requestBody),
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
