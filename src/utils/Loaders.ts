import { defer } from 'react-router-dom';
import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { getFriendsList } from '../friend_control/getFriendsList';
import { getGroupsList } from '../friend_control/getGroupsList';
import { getInvitations } from '../friend_control/getInvitations';
import { getUserInfo } from '../user_control/getUserInfo';
import { getChats } from '../chat_control/getChats';
import { getDetailedMessages } from '../chat_control/getDetailedMessages';
import { listApplicationsForAllChats } from '../chat_control/listApplicationsForAllChats';

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

export async function InvitationsAndApplicationsForChatAndChatsRelatedWithCurrentUserLoader(
  queryClient: QueryClient,
) {
  return defer({
    invitations: fetchDataForLoaders(queryClient, ['invitations'], getInvitations),
    applicationsForChat: fetchDataForLoaders(
      queryClient,
      ['applications_for_chat'],
      listApplicationsForAllChats,
    ),
    chatsRelatedWithCurrentUser: fetchDataForLoaders(
      queryClient,
      ['chats_related_with_current_user'],
      getChats,
    ),
  });
}

export async function UserLoader(queryClient: QueryClient) {
  return defer({
    user: fetchDataForLoaders(queryClient, ['user'], getUserInfo),
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

export async function UserAndFriendsAndDetailedMessagesLoader(
  queryClient: QueryClient,
  chat_id: string,
) {
  return defer({
    user: fetchDataForLoaders(queryClient, ['user'], getUserInfo),
    friends: fetchDataForLoaders(queryClient, ['friends'], getFriendsList),
    detailedMessages: fetchDataForLoaders(queryClient, ['detailed_messages', chat_id], () =>
      getDetailedMessages(Number(chat_id)),
    ),
  });
}
