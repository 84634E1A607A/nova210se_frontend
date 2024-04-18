import { Link, useLocation } from 'react-router-dom';
import { Friend, InvitationSourceType, LeastUserInfo } from '../utils/types';
import { useUserName } from '../utils/UrlParamsHooks';
import { useQueryClient } from '@tanstack/react-query';
import { assertIsFriendsList } from '../utils/asserts';
import { Avatar } from '../utils/ui/Avatar';
import { SingleFriendSetting } from './SingleFriendSetting';
import { useCollapse } from 'react-collapsed';
import { ReactComponent as Foldup } from '../svg/fold-up-svgrepo-com.svg';
import { ReactComponent as Folddown } from '../svg/fold-down-svgrepo-com.svg';

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

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  let source: InvitationSourceType = 'search';

  // TODO: chat group id source is not implemented

  if (!location.pathname.includes(`${userName}/search_friend`)) {
    /* give it a group number */
  }

  return (
    <div>
      <div className="flex flex-row h-fit justify-evenly items-center bg-gray-300 rounded-lg p-2">
        <div className="h-11 p-1 flex">
          <Avatar
            url={leastUserInfo.avatar_url}
            enablePopup={true}
            detailedInfo={{
              user_name: leastUserInfo.user_name,
              id: leastUserInfo.id,
              email: leastUserInfo.email,
              phone: leastUserInfo.phone,
              nickname: friend?.nickname,
              avatar_url: leastUserInfo.avatar_url,
            }}
          />
        </div>

        <div className="flex flex-col">
          <p>{userNameToDisplay}</p>
          <p>
            {groupName === undefined || groupName === null || groupName === ''
              ? 'default group'
              : groupName}
          </p>
          <p>
            {leastUserInfo.phone === undefined || leastUserInfo.phone === ''
              ? null
              : leastUserInfo.phone}
          </p>
          <p>
            {leastUserInfo.email === undefined || leastUserInfo.email === ''
              ? null
              : leastUserInfo.email}
          </p>
        </div>

        {isFriend ? (
          <span
            {...getToggleProps()}
            role="img"
            aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
            className=" inline-block w-10 cursor-pointer items-center"
          >
            {isExpanded ? (
              <Foldup className="fill-teal-900 w-6 h-6" />
            ) : (
              <Folddown className="fill-teal-900 w-6 h-6" />
            )}
          </span>
        ) : (
          <Link to={`/${userName}/invite`} state={{ source: source, id: leastUserInfo.id }}>
            invite
          </Link>
        )}
      </div>
      {isFriend ? (
        <div {...getCollapseProps()}>
          <SingleFriendSetting friendUserId={friend!.friend.id} />
        </div>
      ) : null}
    </div>
  );
}
