import { useCookies } from 'react-cookie';
import { deleteFriend } from './deleteFriend';

type Props = { friendUserId: number };

export function DeleteFriendButton({ friendUserId }: Props) {
  const [cookie] = useCookies(['csrftoken']);

  const onClick = async () => {
    deleteFriend(friendUserId, cookie.csrftoken);
  };

  return (
    <button type="button" onClick={onClick}>
      Delete Friend
    </button>
  );
}
