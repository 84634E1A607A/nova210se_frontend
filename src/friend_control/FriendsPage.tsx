import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsList, assertIsGroupsList } from '../utils/Asserts';
import { FriendsList } from './FriendsList';
import { assertIsFriendsGroupsData } from '../utils/AssertsForRouterLoader';

/**
 * @description for listing all the friends and chat groups, categorized by friend group.
 * Outlet: to show SingleFriendSetting component if a frined is clicked
 */
export function FriendsPage() {
  const data = useLoaderData();
  assertIsFriendsGroupsData(data);

  return (
    <div className="flex flex-grow flex-col">
      <div className="text-900 h-fit bg-teal-100 py-3 text-3xl font-medium">Friends Page</div>
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
