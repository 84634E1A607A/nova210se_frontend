import { assertIsLeastUserInfo } from '../utils/Asserts';
import { LeastUserInfo } from '../utils/Types';

export async function getUserInfo(): Promise<LeastUserInfo | undefined> {
  try {
    const response = await fetch(process.env.REACT_APP_API_URL!.concat('/user'), {
      method: 'GET',
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
    const userInfo = data.data;
    assertIsLeastUserInfo(userInfo);
    return userInfo;
  } catch (e) {
    console.error(e);
  }
}
