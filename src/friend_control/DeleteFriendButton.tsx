import { useCookies } from 'react-cookie';
import { deleteFriend } from './deleteFriend';
import { useNavigate, useParams } from 'react-router-dom';

type Props = { friendUserId: number };
type Params = { user_name: string };

export function DeleteFriendButton({ friendUserId }: Props) {
  const [cookie] = useCookies(['csrftoken']);

  const navigate = useNavigate();

  const params = useParams<Params>();

  const onClick = async () => {
    deleteFriend(friendUserId, cookie.csrftoken);
    navigate(`/${params.user_name!}/friends`);
  };

  return (
    <button type="button" onClick={onClick}>
      Delete Friend
    </button>
  );
}
