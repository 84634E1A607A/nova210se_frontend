import { useParams } from 'react-router-dom';
import { DeleteFriendButton } from './DeleteFriendButton';

type Params = { user_name: string; friend_user_id: string };

export function SingleFriendSetting() {
  const params = useParams<Params>();
  return (
    <div>
      <DeleteFriendButton friendUserId={parseInt(params.friend_user_id!)} />
    </div>
  );
}
