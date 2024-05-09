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
      <div className="mb-1 flex h-fit flex-grow flex-row items-center justify-evenly rounded-lg bg-gray-300 py-2">
        <div className="mx-2 flex h-11">
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

        <div className="flex flex-grow"></div>

        {isFriend ? (
          <div
            {...getToggleProps()}
            role="img"
            aria-label={isExpanded ? 'Expanded' : 'Collapsed'}
            className="flex cursor-pointer"
          >
            {isExpanded ? (
              <Foldup className="h-8 w-8 fill-teal-900" />
            ) : (
              <Folddown className="h-8 w-8 fill-teal-900" />
            )}
          </div>
        ) : (
          <Link
            className="focus:shadow-outline mx-2 rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            to={`/${userName}/invite`}
            state={{ source: source, id: leastUserInfo.id }}
          >
            Invite
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
