import { LeastFriendInfo } from '../../utils/Types';
import { Avatar } from '../../utils/ui/Avatar';

/**
 * @description A friend tab in a multiselect component.
 * @param friend A friend to be displayed in one multiselect tab.
 */
export const FriendTabTemplate = (friend: LeastFriendInfo) => {
  return (
    <div className="align-items-center flex">
      <div className="mr-2" style={{ width: '18px' }}>
        <Avatar url={friend.avatarUrl} />
      </div>
      <div>{friend.displayName}</div>
    </div>
  );
};
