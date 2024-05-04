import { assertIsLeastUserInfo } from '../utils/Asserts';
import { LeastUserInfo } from '../utils/Types';

export async function searchFriend(searchParam: string): Promise<Array<LeastUserInfo>> {
  const userList: Array<LeastUserInfo> = [];
  if (searchParam === '') return userList;

  const fetchList = async (searchParamSent: string | number) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL!.concat('/friend/find'), {
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
      });
      if (!response.ok) throw new Error('Fetch failed to search friend!');
      const data = await response.json();
      let body = data.data;
      if (body === undefined) body = [];
      assertIsLeastUserInfoList(body);
      userList.push(...body);
    } catch (e) {
      console.error(e);
      window.alert('Failed to search friend');
    }
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
