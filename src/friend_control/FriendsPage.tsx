// import { useQueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsList, assertIsFriendsListData, assertIsGroupsList } from '../utils/asserts';
import { FriendsList } from './FriendsList';

/* for listing all the friends and chat groups, categorized by friend group
 */
export function FriendsPage() {
  // const queryClient = useQueryClient();
  const data = useLoaderData(); // { friends: Friend[] }, and this type/structure is stipulated by react-query key
  assertIsFriendsListData(data);
  return (
    <div>
      <Suspense fallback={<div>Loading friends list...</div>}>
        <Await resolve={data}>
          {(data) => {
            const friends = data.friends;
            assertIsFriendsList(friends);
            const groups = data.groups;
            assertIsGroupsList(groups);
            return <FriendsList friends={friends} groups={groups} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
