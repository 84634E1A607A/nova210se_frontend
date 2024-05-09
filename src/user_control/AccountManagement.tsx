import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { theme } from '../utils/ui/themes';
import 'primeicons/primeicons.css';
import { Suspense } from 'react';
import { assertIsUserData } from '../utils/AssertsForRouterLoader';
import { assertIsLeastUserInfo } from '../utils/Asserts';
import { Avatar } from '../utils/ui/Avatar';
import EditDialog from './components/EditDialog';

/**
 * For changing username, avatar_url, password etc. To change e-mail and phone number. Or to logout, delete account, etc.
 * @returns JSX.Element
 */
export function AccountManagement() {
  const navigate = useNavigate();

  const loaderData = useLoaderData();
  assertIsUserData(loaderData);

  return (
    <Suspense>
      <Await resolve={loaderData.user}>
        {(user) => {
          assertIsLeastUserInfo(user);
          return (
            <div className="me-5 mt-3 flex flex-grow flex-col">
              <div className="surface-0">
                <div className="text-900 mb-2 text-3xl font-medium">User Information</div>
                <div className="text-500">You can modify your current info here.</div>
                <div className="text-500 mb-5">
                  If you want to edit your email, phone number, or password, you have to provide
                  your old password.
                </div>
                <div className="parent-container w-full">
                  <ul className="m-0 list-none px-10">
                    <li className="align-items-center border-top-1 border-300 flex h-52 px-2 py-3">
                      <div className="text-500 w-6 font-medium md:w-2">Avatar</div>
                      <div className="md:flex-order-0 flex-order-1 flex flex-grow items-center justify-center md:w-8">
                        <div className="h-32 w-32 ">
                          <Avatar url={user.avatar_url} />
                        </div>
                      </div>
                      <EditDialog field="Avatar" />
                    </li>
                    <li className="align-items-center  border-top-1 border-300 flex flex-wrap px-2 py-3">
                      <div className="text-500 w-6 font-medium md:w-2">User Name</div>
                      <div className="text-900 md:flex-order-0 flex-order-1 w-full md:w-8">{`${user.user_name}`}</div>
                      <EditDialog field="User Name" />
                    </li>
                    <li className="align-items-center border-top-1 border-300 flex flex-wrap px-2 py-3">
                      <div className="text-500 w-6 font-medium md:w-2">Email</div>
                      <div className="text-900 md:flex-order-0 flex-order-1 w-full md:w-8">
                        {`${user.email}`}
                      </div>
                      <EditDialog field="Email" />
                    </li>
                    <li className="align-items-center border-top-1 border-bottom-1 border-300 flex flex-wrap px-2 py-3">
                      <div className="text-500 w-6 font-medium md:w-2">Phone</div>
                      <div className="text-900 md:flex-order-0 flex-order-1 line-height-3 w-full md:w-8">
                        {`${user.phone}`}
                      </div>
                      <EditDialog field="Phone" />
                    </li>
                    <li className="align-items-center border-top-1 border-bottom-1 border-300 flex flex-wrap px-2 py-3">
                      <div className="text-500 w-6 font-medium md:w-2">Password</div>
                      <div className="text-900 md:flex-order-0 flex-order-1 line-height-3 w-full md:w-8">
                        ************
                      </div>
                      <EditDialog field="Password" />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-row justify-center gap-10 pt-4">
                <button
                  className="rounded bg-teal-500 px-4 py-2 font-bold text-white hover:bg-teal-600
          focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  style={{ backgroundColor: theme.tertiary_container }}
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
                <button
                  className="rounded bg-teal-700 px-4 py-2 font-bold text-white hover:bg-teal-900
          focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  style={{ backgroundColor: theme.error }}
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      'Are you sure you want to delete your account?',
                    );
                    if (!confirmDelete) return;
                    deleteAccount();
                    navigate('/');
                    window.alert('Account deleted');
                  }}
                >
                  Delete account
                </button>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

export type EditingInfo = {
  old_password?: string;
  new_password?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  user_name?: string;
};
