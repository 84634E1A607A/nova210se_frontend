import { defer } from 'react-router-dom';
import { assertIsFriendsGroupsData } from './queryRouterLoaderAsserts';
import { QueryClient } from '@tanstack/react-query';
import { getFriendsList } from '../friend_control/getFriendsList';
import { getGroupsList } from '../friend_control/getGroupsList';
import { getInvitations } from '../friend_control/getInvitations';
import { getUserInfo } from '../user_control/getUserInfo';

export async function FriendsGroupsLoader(queryClient: QueryClient) {
  const existingData = queryClient.getQueryData(['friends', 'groups']);
  if (existingData) {
    assertIsFriendsGroupsData(existingData);
    return defer({ friends: existingData.friends, groups: existingData.groups });
  }
  return defer({
    friends: queryClient.fetchQuery({ queryKey: ['friends'], queryFn: getFriendsList }),
    groups: queryClient.fetchQuery({ queryKey: ['groups'], queryFn: getGroupsList }),
  });
}

export async function FriendsLoader(queryClient: QueryClient) {
  const existingData = queryClient.getQueryData(['friends']);
  if (existingData) return defer({ friends: existingData });
  return defer({
    friends: queryClient.fetchQuery({
      queryKey: ['friends'],
      queryFn: getFriendsList,
    }),
  });
}

export async function InvitationsLoader(queryClient: QueryClient) {
  const existingData = queryClient.getQueryData(['invitations']);
  if (existingData) return defer({ invitaions: existingData });
  return defer({
    invitaions: queryClient.fetchQuery({
      queryKey: ['invitations'],
      queryFn: getInvitations,
    }),
  });
}

export async function UserLoader(queryClient: QueryClient) {
  const existingData = queryClient.getQueryData(['user']);
  if (existingData) return defer({ user: existingData });
  return defer({
    user: queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: getUserInfo,
    }),
  });
}
