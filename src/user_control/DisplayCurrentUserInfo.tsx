import { Await, useLoaderData } from 'react-router-dom';
import { assertIsUserData } from '../utils/queryRouterLoaderAsserts';
import { Suspense } from 'react';
import { assertIsLeastUserInfo } from '../utils/asserts';
import { Avatar } from '../utils/ui/Avatar';

type Props = { isIconOnly?: boolean };

export function DisplayCurrentUserInfo({ isIconOnly = true }: Props) {
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
                <Avatar url={user.avatar_url} />
              </div>
              {!isIconOnly && (
                <div className="items-start mt-3 " style={{ maxWidth: 250 }}>
                  <div className="flex items-center mt-1">
                    <span className="font-medium mr-2">Username:</span>
                    <span className="truncate block" title={`${user.user_name}`}>
                      {user.user_name}
                    </span>
                  </div>
                  <div className="flex items-center mt-1" style={{ maxWidth: 250 }}>
                    <span className="font-medium mr-2">Email:</span>
                    <span className="truncate block " title={`${user.email}`}>
                      {user.email === undefined || user.email === '' ? 'N/A' : user.email}
                    </span>
                  </div>
                  <div className="flex items-center mt-1" style={{ maxWidth: 250 }}>
                    <span className="font-medium mr-2">Phone:</span>
                    <span className="truncate block" title={`${user.phone}`}>
                      {user.phone === undefined || user.phone === '' ? 'N/A' : user.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
