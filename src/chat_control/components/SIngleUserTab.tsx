import { LeastUserInfo } from '../../utils/types';
import { Avatar } from '../../utils/ui/Avatar';

interface Props {
  user: LeastUserInfo;
}

/**
 * @description For a simple tab to display a user in details of a chat, like that of Wechat.
 * It can be clicked to navigate to the detail of this user (a stranger or a friend).
 * @warning The caller must ensure that the user is not undefined.
 */
export function SingleUserTab({ user }: Props) {
  return (
    <div className="flex flex-col">
      <Avatar url={user!.avatar_url} />
      <p>{user.user_name}</p>
    </div>
  );
}
