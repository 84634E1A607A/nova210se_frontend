import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsList, assertIsGroupsList } from '../utils/asserts';
import { FriendsList } from './FriendsList';
import { assertIsFriendsGroupsData } from '../utils/queryRouterLoaderAsserts';

/**
 * @description for listing all the friends and chat groups, categorized by friend group
 */
export function FriendsPage() {
  const data = useLoaderData();
  assertIsFriendsGroupsData(data);

  return (
    <div>
      <Suspense fallback={<div>Loading friends list...</div>}>
        <Await resolve={data.friends}>
          {(friends) => {
            assertIsFriendsList(friends);
            return (
              <Await resolve={data.groups}>
                {(groups) => {
                  assertIsGroupsList(groups);
                  return <FriendsList friends={friends} groups={groups} />;
                }}
              </Await>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
