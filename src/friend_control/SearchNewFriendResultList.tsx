import { useQuery } from '@tanstack/react-query';
import { Await, useLoaderData, useSearchParams } from 'react-router-dom';
import { searchFriend } from './searchFriend';
import { Friend, LeastUserInfo } from '../utils/types';
import { UserDisplayTab } from './UserDisplayTab';
import { assertIsFriendsList } from '../utils/asserts';
import { Suspense } from 'react';

// type Params = { user_name: string; search_param: string };

export function SearchNewFriendResultList() {
  const [searchParams] = useSearchParams();
  const search_param = searchParams.get('search_param');

  const { isLoading, data: searchNewFriendResultList } = useQuery({
    queryKey: ['new_friends_searched', search_param],
    queryFn: () => {
      if (search_param === null) return Promise.resolve([] as LeastUserInfo[]);
      return searchFriend(search_param);
    },
  });

  const data = useLoaderData();
  assertIsData(data);

  if (isLoading || searchNewFriendResultList === undefined)
    return <div className="w-96 mx-auto mt-6">Loading ...</div>;

  return (
    <div>
      <ul>
        {searchNewFriendResultList.map((user) => {
          return (
            <li key={user.id}>
              <Suspense>
                <Await resolve={data.friends}>
                  {(friends) => {
                    assertIsFriendsList(friends);
                    return <UserDisplayTab leastUserInfo={user} friendsList={friends} />;
                  }}
                </Await>
              </Suspense>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type Data = { friends: Friend[] };

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') throw new Error('Server response is not an object');
  if (data === null) throw new Error('Server response is null');
  if (!('friends' in data)) throw new Error('Server response does not contain friends');
}
