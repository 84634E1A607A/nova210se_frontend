import { useQuery } from '@tanstack/react-query';
import { Await, useLoaderData, useSearchParams } from 'react-router-dom';
import { searchFriend } from './searchFriend';
import { LeastUserInfo } from '../utils/types';
import { UserDisplayTab } from './UserDisplayTab';
import { assertIsFriendsList } from '../utils/Asserts';
import { Suspense } from 'react';
import { assertIsFriendsData } from '../utils/AssertsForRouterLoader';

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
  assertIsFriendsData(data);

  if (isLoading || searchNewFriendResultList === undefined)
    return <div className="mx-auto mt-6 w-96">Loading ...</div>;

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
