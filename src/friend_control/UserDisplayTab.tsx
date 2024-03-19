import { Link, useLocation, useParams } from 'react-router-dom';
import { Friend, InvitationSourceType, LeastUserInfo } from '../utils/types';
import { DeleteFriendButton } from './DeleteFriendButton';

type Props = { leastUserInfo: LeastUserInfo; friendsList: Friend[] };
type Params = { user_name: string };
/**
 * show all kinds of user info tab in a list of users
 * @param
 * @returns
 */
export function UserDisplayTab({ leastUserInfo, friendsList }: Props) {
  let isFriend = false;
  let userName = '';
  let groupName: undefined | string;
  const friend = friendsList.find((friend) => friend.friend.id === leastUserInfo.id);
  if (friend !== undefined) {
    isFriend = true;
    userName = friend.nickname;
    groupName = friend.group.group_name;
  }

  const params = useParams<Params>();
  const location = useLocation();

  let source: InvitationSourceType = 'search';

  // TODO: chat group id source is not implemented

  if (!location.pathname.includes(`${params.user_name!}/search_friend`)) {
    /* give it a group number */
  }

  // const isFriend = friendsList.some((friend) => friend.friend.id === leastUserInfo.id);
  return (
    <div>
      <img src={leastUserInfo.avatar_url} alt="avatar_url" />
      <p>{userName}</p>
      <p>{groupName ?? null}</p>
      {isFriend ? (
        <div>
          <DeleteFriendButton friendUserId={friend!.friend.id} />
          <Link to="">more</Link>
        </div>
      ) : (
        <Link to={`/${params.user_name!}/invite`} state={{ source: source, id: leastUserInfo.id }}>
          invite
        </Link>
      )}
    </div>
  );
}
