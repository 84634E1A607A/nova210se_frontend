import { Await, useLoaderData } from 'react-router-dom';
import { assertIsUserData } from '../utils/queryRouterLoaderAsserts';
import { Suspense } from 'react';
import { assertIsLeastUserInfo } from '../utils/asserts';
import { Avatar } from '../utils/ui/Avatar';

export function DisplayCurrentUserInfo() {
  const loaderData = useLoaderData();
  assertIsUserData(loaderData);

  return (
    <Suspense>
      <Await resolve={loaderData.user}>
        {(user) => {
          assertIsLeastUserInfo(user);
          return (
            <div className="flex flex-row justify-evenly items-center">
              <div className="p-1 w-10">
                <Avatar url={user.avatar_url} />
              </div>
              <p className="font-medium">{user.user_name}</p>
            </div>
          );
        }}
      </Await>
    </Suspense>
    // <div>user</div>
  );
}
