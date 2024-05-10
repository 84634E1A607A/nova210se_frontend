import { DetailedUserInfo, LeastFriendInfo } from '../../utils/Types';
import { Avatar } from '../../utils/ui/Avatar';

/**
 * @description A user tab in a multiselect component.
 * @param user A user to be displayed in one multiselect tab.
 */
export const UserTabTemplate = (user: LeastFriendInfo | DetailedUserInfo) => {
  let avatar: string | undefined = '';
  if ('avatarUrl' in user) {
    avatar = user.avatarUrl;
  } else {
    avatar = user.avatar_url;
  }
  let displayName = '';
  if ('displayName' in user) {
    displayName = user.displayName;
  } else {
    displayName = user.nickname!;
  }

  return (
    <div className="align-items-center flex">
      <div className="mr-2" style={{ width: '18px' }}>
        <Avatar url={avatar} />
      </div>
      <div>{displayName}</div>
    </div>
  );
};
