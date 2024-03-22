import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, defer, RouterProvider } from 'react-router-dom';
import { Login } from './user_control/Login';
import { MainPageFramework } from './main_page/MainPageFramework';
import { FriendsPage } from './friend_control/FriendsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFriendsList } from './friend_control/getFriendsList';
import { SearchNewFriend } from './friend_control/SearchNewFriend';
import { getGroupsList } from './friend_control/getGroupsList';
import { SingleFriendSetting } from './friend_control/SingleFriendSetting';
import { InviteFriendPage } from './friend_control/InviteFriendPage';
import { GroupSetting, groupSettingAction } from './friend_control/GroupSetting';
import { OngoingInvitations } from './friend_control/OngoingInvitations';
import { getInvitations } from './friend_control/getInvitations';
import { assertIsFriendsGroupsData } from './utils/queryRouterLoaderAsserts';
import { AccountManagement } from './user_control/AccountManagement';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: ':user_name',
        element: <MainPageFramework />,
        // has a loader to load chats and group chats
        children: [
          {
            path: 'friends',
            element: <FriendsPage />,
            loader: async () => {
              const existingData = queryClient.getQueryData(['friends', 'groups']);
              if (existingData) {
                assertIsFriendsGroupsData(existingData);
                return defer({ friends: existingData.friends, groups: existingData.groups });
              }
              return defer({
                friends: queryClient.fetchQuery({ queryKey: ['friends'], queryFn: getFriendsList }),
                groups: queryClient.fetchQuery({ queryKey: ['groups'], queryFn: getGroupsList }),
              });
            },
            children: [
              // this child has no Outlet in its parent, so it requires nav to reach it
              {
                path: ':friend_user_id', // /:user_name/friends/:friend_user_id
                element: <SingleFriendSetting />,
              },
            ],
          },
          {
            path: 'search_friend',
            element: <SearchNewFriend />,
            loader: async () => {
              const existingData = queryClient.getQueryData(['friends']);
              if (existingData) return defer({ friends: existingData });
              return defer({
                friends: queryClient.fetchQuery({
                  queryKey: ['friends'],
                  queryFn: getFriendsList,
                }),
              });
            },
          },

          {
            path: 'invite',
            element: <InviteFriendPage />,
          },
          {
            path: 'group_setting/:group_id',
            element: <GroupSetting />,
            action: groupSettingAction,
          },
          {
            path: 'account_management',
            element: <AccountManagement />,
          },
          {
            path: 'invitation_list',
            element: <OngoingInvitations />,
            loader: async () => {
              const existingData = queryClient.getQueryData(['invitations']);
              if (existingData) return defer({ invitaions: existingData });
              return defer({
                invitaions: queryClient.fetchQuery({
                  queryKey: ['invitations'],
                  queryFn: getInvitations,
                }),
              });
            },
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
