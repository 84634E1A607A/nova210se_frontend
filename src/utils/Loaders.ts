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

export async function FriendsAndChatsRelatedWithCurrentUserLoader(queryClient: QueryClient) {
  return defer({
    friends: fetchDataForLoaders(queryClient, ['friends'], getFriendsList),
    chatsRelatedWithCurrentUser: fetchDataForLoaders(
      queryClient,
      ['chats_related_with_current_user'],
      getChats,
    ),
  });
}

export async function UserAndFriendsLoader(queryClient: QueryClient) {
  return defer({
    user: fetchDataForLoaders(queryClient, ['user'], getUserInfo),
    friends: fetchDataForLoaders(queryClient, ['friends'], getFriendsList),
  });
}
