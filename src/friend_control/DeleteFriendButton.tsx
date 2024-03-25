import { useUserName } from '../utils/UrlParamsHooks';
import { deleteFriend } from './deleteFriend';
import { useNavigate } from 'react-router-dom';

type Props = { friendUserId: number };

export function DeleteFriendButton({ friendUserId }: Props) {
  const navigate = useNavigate();

  const userName = useUserName();

  const onClick = async () => {
    deleteFriend(friendUserId);
    navigate(`/${userName}/friends`);
  };

  return (
    <button type="button" onClick={onClick}>
      Delete Friend
    </button>
  );
}
