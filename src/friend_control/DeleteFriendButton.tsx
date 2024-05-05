import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserName } from '../utils/UrlParamsHooks';
import { deleteFriend } from './deleteFriend';
import { useNavigate } from 'react-router-dom';

type Props = { friendUserId: number };

export function DeleteFriendButton({ friendUserId }: Props) {
  const navigate = useNavigate();

  const userName = useUserName();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => await deleteFriend(friendUserId),
    onSuccess: (deleteSuccessful) => {
      if (deleteSuccessful) {
        queryClient.removeQueries({ queryKey: ['friends'] });
        queryClient.removeQueries({ queryKey: ['chats_related_with_current_user'] });
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
