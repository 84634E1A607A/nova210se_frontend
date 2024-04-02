import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './user_control/Login';
import { MainPageFramework } from './main_page/MainPageFramework';
import { FriendsPage } from './friend_control/FriendsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchNewFriend } from './friend_control/SearchNewFriend';
import { InviteFriendPage } from './friend_control/InviteFriendPage';
import { groupSettingAction } from './friend_control/GroupSetting';
import { OngoingInvitations } from './friend_control/OngoingInvitations';
import { AccountManagement } from './user_control/AccountManagement';
import { FriendsGroupsLoader, FriendsLoader, InvitationsLoader, UserLoader } from './utils/Loaders';
import { ErrorPage } from './utils/ErrorPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: ':user_name',
        element: <MainPageFramework />,
        loader: async () => UserLoader(queryClient),
        // has a loader to load chats and group chats
        children: [
          {
            path: 'friends',
            element: <FriendsPage />,
            loader: async () => FriendsGroupsLoader(queryClient),
            action: groupSettingAction,
          },
          {
            path: 'search_friend',
            element: <SearchNewFriend />,
            loader: async () => FriendsLoader(queryClient),
          },
          {
            path: 'invite',
            element: <InviteFriendPage />,
          },
          // {
          //   path: 'group_setting/:group_id',
          //   element: <GroupSetting />,
          //   action: groupSettingAction,
          // },
          {
            path: 'account_management',
            element: <AccountManagement />,
          },
          {
            path: 'invitation_list',
            element: <OngoingInvitations />,
            loader: async () => InvitationsLoader(queryClient),
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
