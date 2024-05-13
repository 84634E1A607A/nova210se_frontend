import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsFriendsList, assertIsGroupsList } from '../utils/Asserts';
import { FriendsList } from './FriendsList';
import { assertIsFriendsGroupsData } from '../utils/AssertsForRouterLoader';
import '../chat_control/pages/css/auto-hidden-scroll.css';

/**
 * @description for listing all the friends and chat groups, categorized by friend group.
 * Outlet: to show SingleFriendSetting component if a friend is clicked
 */
export function FriendsPage() {
  const data = useLoaderData();
  assertIsFriendsGroupsData(data);

  return (
    <div className="surface-0 m-auto box-border inline-block min-h-[80%] min-w-[80%] rounded-lg p-6 shadow-md">
      <div className="text-900 mb-4 h-fit text-3xl font-medium">Friends</div>
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
