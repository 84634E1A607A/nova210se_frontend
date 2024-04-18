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
            <div className="w-32 h-15 flex flex-col items-center">
              <div className="w-4 h-10">
                <Avatar
                  url={user.avatar_url}
                  enablePopup={true}
                  detailedInfo={{
                    user_name: user.user_name,
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    nickname: undefined,
                    avatar_url: user.avatar_url,
                  }}
                />
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
