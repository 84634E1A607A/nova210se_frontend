import { LeastUserInfo } from '../utils/Types';
import { Avatar } from '../utils/ui/Avatar';

type Props = { leastUserInfo: LeastUserInfo };

/**
 * @description In invitations list and applications for group chat list.
 * @param leastUserInfo
 * @constructor
 */
export function UserDisplayTabInInvitations({ leastUserInfo }: Props) {
  return (
    <div>
      <div className="flex h-12 flex-row items-center justify-evenly rounded-lg bg-gray-300 p-2">
        <div className="flex h-11 p-1">
          <Avatar url={leastUserInfo.avatar_url} />
        </div>

        <div className="flex flex-col">
          <p>{leastUserInfo.user_name}</p>
        </div>
      </div>
    </div>
  );
}
