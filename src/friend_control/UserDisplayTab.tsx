import { Link } from 'react-router-dom';
import { Friend, InvitationSourceType, LeastUserInfo } from '../utils/Types';
import { useUserName } from '../utils/UrlParamsHooks';
import { Avatar } from '../utils/ui/Avatar';
import { SingleFriendSetting } from './SingleFriendSetting';
import { useCollapse } from 'react-collapsed';
import { ReactComponent as Foldup } from '../svg/fold-up-svgrepo-com.svg';
import { ReactComponent as Folddown } from '../svg/fold-down-svgrepo-com.svg';

/**
 * show all kinds of user info tab in a list of users (such as friends or searched users (including strangers) list)
 * @param friendsList: Friend[] (all friends of current user)
 */
export function UserDisplayTab({ leastUserInfo, friendsList }: Props) {
  let isFriend = false;
  let userNameToDisplay = leastUserInfo.user_name;

  const friend = friendsList.find((friend) => friend.friend.id === leastUserInfo.id);
  if (friend !== undefined) {
    isFriend = true;
    if (friend.nickname !== '') userNameToDisplay = friend.nickname;
  }

  const userName = useUserName();

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  const source: InvitationSourceType = 'search';

  return (
    <div>
      <div className="mb-1 flex h-fit flex-grow flex-row items-center justify-evenly rounded-lg bg-gray-300 pb-2 pt-2">
        <div className="flex h-11 p-1">
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

        <div className="ms-3 flex flex-col">
          <p>{userNameToDisplay}</p>
        </div>

        {isFriend ? (
          <span
            {...getToggleProps()}
            role="img"
            aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
            className="flex w-10 cursor-pointer items-end justify-end"
          >
            {isExpanded ? (
              <Foldup className="ml-auto h-6 w-6 fill-teal-900" />
            ) : (
              <Folddown className="ml-auto h-6 w-6 fill-teal-900" />
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

interface Props {
  leastUserInfo: LeastUserInfo;
  friendsList: Friend[];
}
