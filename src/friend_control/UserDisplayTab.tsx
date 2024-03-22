import { Link, useLocation } from 'react-router-dom';
import { Friend, InvitationSourceType, LeastUserInfo } from '../utils/types';
import { DeleteFriendButton } from './DeleteFriendButton';
import { useUserName } from '../utils/UrlParamsHooks';
import { useQueryClient } from '@tanstack/react-query';
import { assertIsFriendsList } from '../utils/asserts';

type Props = { leastUserInfo: LeastUserInfo; friendsList?: Friend[] };

/**
 * show all kinds of user info tab in a list of users (such as friends or searched strangers list)
 * @param friendsList: Friend[] (all friends of current user)
 * @returns
 */
export function UserDisplayTab({ leastUserInfo, friendsList }: Props) {
  let isFriend = false;
  let userNameToDisplay = leastUserInfo.user_name;
  let groupName: undefined | string;

  const queryCLient = useQueryClient();

  if (friendsList === undefined) {
    friendsList = queryCLient.getQueryData(['friends']);
    assertIsFriendsList(friendsList);
  }
  const friend = friendsList.find((friend) => friend.friend.id === leastUserInfo.id);
  if (friend !== undefined) {
    isFriend = true;
    if (friend.nickname !== '') userNameToDisplay = friend.nickname;
    groupName = friend.group.group_name;
  }

  const userName = useUserName();
  const location = useLocation();

  let source: InvitationSourceType = 'search';

  // TODO: chat group id source is not implemented

  if (!location.pathname.includes(`${userName}/search_friend`)) {
    /* give it a group number */
  }

  return (
    <div>
      <img src={leastUserInfo.avatar_url} alt="avatar_url" />
      <p>{userNameToDisplay}</p>
      <p>{groupName ?? null}</p>
      {isFriend ? (
        <div>
          <DeleteFriendButton friendUserId={friend!.friend.id} />
          <Link to="">more</Link>
        </div>
      ) : (
        <Link to={`/${userName}/invite`} state={{ source: source, id: leastUserInfo.id }}>
          invite
        </Link>
      )}
    </div>
  );
}
