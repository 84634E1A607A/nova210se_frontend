import { assertIsApiError, assertIsLeastUserInfo } from '../utils/Asserts';
import { EditingInfo } from './AccountManagement';

/**
 *
 * @param old_password: string
 * @param new_password: string
 * @param avatar_url: string
 * @returns Promise<LeastUserInfo | undefined>
 * Without new_password, the old_password can be arbitrary
 */
export async function editUserInfo(
  old_password: string,
  new_password: string,
  avatar_url: string,
  phone: string,
  email: string,
  user_name: string,
) {
  const avatarUrlInRequestBody = avatar_url === '' ? {} : { avatar_url };
  const userNameInRequestBody = user_name === '' ? {} : { user_name };
  let requestBody: EditingInfo = { ...avatarUrlInRequestBody, ...userNameInRequestBody };
  if (!(phone === '' && new_password === '' && email === '')) {
    requestBody = { ...requestBody, old_password };
    if (phone !== '') requestBody = { ...requestBody, phone };
    if (new_password !== '') requestBody = { ...requestBody, new_password };
    if (email !== '') requestBody = { ...requestBody, email };
  }

  const response = await fetch(process.env.REACT_APP_API_URL!.concat('/user'), {
    method: 'PATCH',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    assertIsApiError(error);
    throw new Error(error.error);
  }
  const data = await response.json();
  const user = data.data;
  assertIsLeastUserInfo(user);
  return user;
}
