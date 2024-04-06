import { LeastUserInfo } from '../utils/types';
import { Avatar } from '../utils/ui/Avatar';

type Props = { leastUserInfo: LeastUserInfo };

export function UserDisplayTabInInvitations({ leastUserInfo }: Props) {
  return (
    <div>
      <div className="flex flex-row h-12 justify-evenly items-center bg-gray-300 rounded-lg p-2">
        <div className="h-11 p-1 flex">
          <Avatar url={leastUserInfo.avatar_url} />
        </div>

        <div className="flex flex-col">
          <p>{leastUserInfo.user_name}</p>
        </div>
      </div>
    </div>
  );
}
