import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchFriend } from './searchFriend';
import { LeastUserInfo } from '../utils/types';
import { useCookies } from 'react-cookie';
// import { useEffect } from 'react';

// type Params = { user_name: string; search_param: string };

export function SearchNewFriendResultList() {
  const [cookies] = useCookies(['csrftoken']);

  const [searchParams] = useSearchParams();
  const search_param = searchParams.get('search_param');
  // useEffect(() => {}, [searchParams]);
  // not sure will this rerender once search param is reset, maybe queryKey's change will trigger requery
  const { isLoading, data: searchNewFriendResultList } = useQuery({
    queryKey: ['new_friends_searched', search_param],
    queryFn: () => {
      if (search_param === null) return Promise.resolve([] as LeastUserInfo[]);
      return searchFriend(search_param, cookies.csrftoken);
    },
  });

  if (isLoading || searchNewFriendResultList === undefined) {
    return <div className="w-96 mx-auto mt-6">Loading ...</div>;
  }
  return (
    <div>
      <ul>
        {searchNewFriendResultList.map((user) => {
          return <li key={user.id}>{user.user_name}</li>;
        })}
      </ul>
    </div>
  );
}
