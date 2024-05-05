import { useForm } from 'react-hook-form';
import { ValidationError, getEditorStyle } from '../utils/ValidationError';
import { editUserInfo } from './editUserInfo';
import { logout } from './logout';
import { deleteAccount } from './deleteAccount';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { theme } from '../utils/ui/themes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LeastUserInfo } from '../utils/types';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { info } from 'console';
import { Suspense } from 'react';
import { assertIsUserData } from '../utils/AssertsForRouterLoader';
import userEvent from '@testing-library/user-event';
import { assertIsLeastUserInfo } from '../utils/Asserts';
import { Avatar } from '../utils/ui/Avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { SettingConfirmDialog } from './components/SettingConfirmDialog';
import TestDialog from './components/EditDialog';
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
            <div className="flex flex-col flex-grow mt-3 me-5">
              <div className="surface-0">
                <div className="font-medium text-3xl text-900 mb-2">User Information</div>
                <div className="text-500">You can modify your current info here.</div>
                <div className="text-500 mb-5">
                  If you want to edit your email, phone number, or password, you have to provide
                  your old password.
                </div>
                <div className="parent-container w-full">
                  <ul className="list-none px-10 m-0">
                    <li className="flex h-52 align-items-center py-3 px-2 border-top-1 border-300">
                      <div className="text-500 w-6 md:w-2 font-medium">Avatar</div>
                      <div className="flex md:w-8 md:flex-order-0 flex-order-1 flex-grow justify-center items-center">
                        <div className="h-32 w-32 ">
                          <Avatar url={user.avatar_url} />
                        </div>
                      </div>
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                      </div>
                    </li>
                    <li className="flex  align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">User Name</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{`${user.user_name}`}</div>
                      <EditDialog field="User Name" />
                      {/* <div className="w-6 md:w-2 flex justify-content-end">
                        <SettingConfirmDialog changeField="User Name" />
                      </div> */}
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {`${user.email}`}
                      </div>
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <SettingConfirmDialog changeField="Email" requireOldPassword={true} />
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Phone</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        {`${user.phone}`}
                      </div>
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                      </div>
                    </li>
                    <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                      <div className="text-500 w-6 md:w-2 font-medium">Password</div>
                      <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                        ************
                      </div>
                      <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col pt-6 space-y-2 items-center mb-5">
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded 
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  style={{ backgroundColor: theme.tertiary_container }}
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </button>
                <button
                  className="bg-teal-700 hover:bg-teal-900 text-white font-bold py-2 px-4 rounded 
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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

function getHiddenOrVisibleEditorStyle(
  newPasswordExists: boolean | undefined,
  phoneExists: boolean | undefined,
  emailExists: boolean | undefined,
) {
  if (!newPasswordExists && !phoneExists && !emailExists) return 'hidden';
}
