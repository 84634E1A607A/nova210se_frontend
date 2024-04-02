import { Link, useLocation } from 'react-router-dom';
import { Friend, InvitationSourceType, LeastUserInfo } from '../utils/types';
import { useUserName } from '../utils/UrlParamsHooks';
import { useQueryClient } from '@tanstack/react-query';
import { assertIsFriendsList } from '../utils/asserts';
import { DeleteFriendButton } from './DeleteFriendButton';
import { Avatar } from '../utils/ui/Avatar';

type Props = { leastUserInfo: LeastUserInfo; friendsList?: Friend[]; inSetting?: boolean };

/**
 * show all kinds of user info tab in a list of users (such as friends or searched strangers list)
 * @param friendsList: Friend[] (all friends of current user)
 * @returns
 */
export function UserDisplayTab({ leastUserInfo, friendsList, inSetting }: Props) {
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

  const displayTab = () => {
    if (isFriend) {
      if (!inSetting) return <Link to={`/${userName}/friends/${friend!.friend.id}`}>More</Link>;
      else return <DeleteFriendButton friendUserId={friend!.friend.id} />;
    } else {
      return (
        <Link to={`/${userName}/invite`} state={{ source: source, id: leastUserInfo.id }}>
          invite
        </Link>
      );
    }
  };

  return (
    <div className="flex flex-row h-12 justify-evenly items-center bg-gray-300 rounded-lg p-2">
      <div className="h-11 p-1 flex">
        <Avatar url={leastUserInfo.avatar_url} />
      </div>

      <div className="flex flex-col">
        <p>{userNameToDisplay}</p>
        <p>
          {groupName === undefined || groupName === null || groupName === ''
            ? 'default group'
            : groupName}
        </p>
      </div>

      {displayTab()}
    </div>
  );
}
