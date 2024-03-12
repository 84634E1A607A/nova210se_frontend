import { useQueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsList, assertIsFriendsListData } from '../utils/asserts';
import { FriendsList } from './FriendsList';

/* for listing all the friends and chat groups, categorized by friend group
 */
export function FriendsPage() {
  const queryClient = useQueryClient();
  const data = useLoaderData(); // { friends: Friend[] }, and this type/structure is stipulated by react-query key
  assertIsFriendsListData(data);
  return (
    <div>
      <Suspense fallback={<div>Loading friends list...</div>}>
        <Await resolve={data.friends}>
          {(friends) => {
            assertIsFriendsList(friends);
            return <FriendsList friends={friends} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
