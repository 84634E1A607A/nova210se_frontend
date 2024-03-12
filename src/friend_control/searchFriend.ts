import { assertIsLeastUserInfo } from '../utils/asserts';
import { LeastUserInfo } from '../utils/types';

export async function searchFriend(searchParam: string): Promise<Array<LeastUserInfo>> {
  const userList: Array<LeastUserInfo> = [];
  if (searchParam === '') return userList;

  const fetchList = async (searchParamSent: string | number) => {
    const resultList = await fetch(process.env.REACT_APP_API_URL!.concat('friend/find'), {
      method: 'POST',
      body: JSON.stringify(
        typeof searchParamSent === 'string'
          ? { name_contains: searchParamSent }
          : { id: searchParamSent },
      ),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.body;
      })
      .then((body) => {
        assertIsLeastUserInfoList(body);
        return body;
      });
    userList.push(...resultList);
  };

  const searchId = parseInt(searchParam);
  if (!Number.isNaN(searchId) && searchId > 0) await fetchList(searchId);
  await fetchList(searchParam);
  return userList;
}

function assertIsLeastUserInfoList(body: unknown): asserts body is Array<LeastUserInfo> {
  if (!Array.isArray(body)) throw new Error('Server response is not an array');
  for (const userInfo of body) assertIsLeastUserInfo(userInfo);
}
