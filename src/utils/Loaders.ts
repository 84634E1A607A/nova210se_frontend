import { defer } from 'react-router-dom';
import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { getFriendsList } from '../friend_control/getFriendsList';
import { getGroupsList } from '../friend_control/getGroupsList';
import { getInvitations } from '../friend_control/getInvitations';
import { getUserInfo } from '../user_control/getUserInfo';
import { getChats } from '../chat_control/getChats';

async function fetchDataForLoaders<T>(
  queryClient: QueryClient,
  queryKey: string[],
  queryFn: QueryFunction<T>,
) {
  const existingData = queryClient.getQueryData(queryKey);
  if (existingData) return existingData as T;
  return queryClient.fetchQuery({
    queryKey,
    queryFn,
  });
}

export async function FriendsGroupsLoader(queryClient: QueryClient) {
  return defer({
    friends: fetchDataForLoaders(queryClient, ['friends'], getFriendsList),
    groups: fetchDataForLoaders(queryClient, ['groups'], getGroupsList),
  });
}

export async function FriendsLoader(queryClient: QueryClient) {
  return defer({
    friends: fetchDataForLoaders(queryClient, ['friends'], getFriendsList),
  });
}

export async function InvitationsLoader(queryClient: QueryClient) {
  return defer({
    invitaions: fetchDataForLoaders(queryClient, ['invitations'], getInvitations),
  });
}

export async function UserLoader(queryClient: QueryClient) {
  return defer({
    user: fetchDataForLoaders(queryClient, ['user'], getUserInfo),
  });
}

export async function ChatsRelatedWithCurrentUserLoader(queryClient: QueryClient) {
  return defer({
    chatsRelatedWithCurrentUser: fetchDataForLoaders(
      queryClient,
      ['chats_related_with_current_user'],
      getChats,
    ),
  });
}

// export async function FriendsGroupsLoader(queryClient: QueryClient) {
//   const existingData = queryClient.getQueryData(['friends', 'groups']);
//   if (existingData) {
//     assertIsFriendsGroupsData(existingData);
//     return defer({ friends: existingData.friends, groups: existingData.groups });
//   }
//   return defer({
//     friends: queryClient.fetchQuery({ queryKey: ['friends'], queryFn: getFriendsList }),
//     groups: queryClient.fetchQuery({ queryKey: ['groups'], queryFn: getGroupsList }),
//   });
// }

// export async function FriendsLoader(queryClient: QueryClient) {
//   const existingData = queryClient.getQueryData(['friends']);
//   if (existingData) return defer({ friends: existingData });
//   return defer({
//     friends: queryClient.fetchQuery({
//       queryKey: ['friends'],
//       queryFn: getFriendsList,
//     }),
//   });
// }

// export async function InvitationsLoader(queryClient: QueryClient) {
//   const existingData = queryClient.getQueryData(['invitations']);
//   if (existingData) return defer({ invitaions: existingData });
//   return defer({
//     invitaions: queryClient.fetchQuery({
//       queryKey: ['invitations'],
//       queryFn: getInvitations,
//     }),
//   });
// }

// export async function UserLoader(queryClient: QueryClient) {
//   const existingData = queryClient.getQueryData(['user']);
//   if (existingData) return defer({ user: existingData });
//   return defer({
//     user: queryClient.fetchQuery({
//       queryKey: ['user'],
//       queryFn: getUserInfo,
//     }),
//   });
// }

// export async function ChatsRelatedWithCurrentUserLoader(queryClient: QueryClient) {
//   const existingData = queryClient.getQueryData(['chats_related_with_current_user']);
//   if (existingData) return defer({ chatsRelatedWithCurrentUser: existingData });
//   return defer({
//     chatsRelatedWithCurrentUser: queryClient.fetchQuery({
//       queryKey: ['chats_related_with_current_user'],
//       queryFn: getChats,
//     }),
//   });
// }
