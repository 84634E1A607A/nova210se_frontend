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
      },
      {
        path: ':user_name/friends',
        element: <FriendsPage />,
        loader: async () => {
          const existingData = queryClient.getQueryData(['friends', 'groups']);
          if (existingData) return defer({ ...existingData });
          return defer({
            friends: queryClient.fetchQuery({ queryKey: ['friends'], queryFn: getFriendsList }),
            groups: queryClient.fetchQuery({ queryKey: ['groups'], queryFn: getGroupsList }),
          });
        },
      },
      {
        path: ':user_name/search_friend',
        element: <SearchNewFriend />,
      },
      {
        path: ':user_name/:friend_user_id',
        element: <SingleFriendSetting />,
      },
      {
        path: ':user_name/invite',
        element: <InviteFriendPage />,
      },
      {
        path: ':user_name/main_page',
        element: <MainPageFramework />,
        children: [],
      },
      {
        path: ':user_name/group_setting/:group_id',
        element: <GroupSetting />,
        action: groupSettingAction,
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
