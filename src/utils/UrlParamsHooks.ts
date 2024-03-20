import { useParams } from 'react-router-dom';
import { UrlParams } from './types';

function useUrlParams() {
  const params = useParams<UrlParams>();
  const userName = params.user_name!;
  const friendUserId = params.friend_user_id ? parseInt(params.friend_user_id) : undefined;
  const groupId = params.group_id ? parseInt(params.group_id) : undefined;
  return { userName, friendUserId, groupId };
}

export function useUserName() {
  const { userName } = useUrlParams();
  return userName;
}

export function useFriendUserId() {
  const { friendUserId } = useUrlParams();
  return friendUserId!;
}

export function useGroupId() {
  const { groupId } = useUrlParams();
  return groupId!;
}
