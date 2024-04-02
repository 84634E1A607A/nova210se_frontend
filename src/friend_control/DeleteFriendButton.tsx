import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserName } from '../utils/UrlParamsHooks';
import { deleteFriend } from './deleteFriend';
import { useNavigate } from 'react-router-dom';
import { Friend } from '../utils/types';

type Props = { friendUserId: number };

export function DeleteFriendButton({ friendUserId }: Props) {
  const navigate = useNavigate();

  const userName = useUserName();

  const onClick = async () => {
    const deleteSuccessful = await deleteFriend(friendUserId);
    navigate(`/${userName}/friends`);
    return deleteSuccessful;
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: onClick,
    onSuccess: (deleteSuccessful) => {
      if (deleteSuccessful) {
        queryClient.setQueryData<Friend[]>(['friends'], (oldFriends) => {
          console.log(oldFriends);
          console.log(oldFriends!.filter((friend) => friend.friend.id !== friendUserId));
          return oldFriends!.filter((friend) => friend.friend.id !== friendUserId);
        });
        navigate(`/${userName}/friends`);
      }
    },
  });

  return (
    <button type="button" onClick={() => mutate()} className="text-red-500">
      Delete Friend
    </button>
  );
}
